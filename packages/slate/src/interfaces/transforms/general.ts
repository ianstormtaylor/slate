import {
  Ancestor,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Operation,
  Path,
  Point,
  Range,
  Scrubber,
  Selection,
  Text,
} from '../../index'

export interface GeneralTransforms {
  /**
   * Transform the editor by an operation.
   */
  transform: (editor: Editor, op: Operation) => void
}

const insertChildren = <T>(xs: T[], index: number, ...newValues: T[]) => [
  ...xs.slice(0, index),
  ...newValues,
  ...xs.slice(index),
]

const replaceChildren = <T>(
  xs: T[],
  index: number,
  removeCount: number,
  ...newValues: T[]
) => [...xs.slice(0, index), ...newValues, ...xs.slice(index + removeCount)]

const removeChildren = replaceChildren

/**
 * Replace a descendant with a new node, replacing all ancestors
 */
const modifyDescendant = <N extends Descendant>(
  editor: Editor,
  path: Path,
  f: (node: N) => N
) => {
  if (path.length === 0) {
    throw new Error('Cannot modify the editor')
  }

  const node = Node.get(editor, path) as N
  const slicedPath = path.slice()
  let modifiedNode: Node = f(node)

  while (slicedPath.length > 1) {
    const index = slicedPath.pop()!
    const ancestorNode = Node.get(editor, slicedPath) as Ancestor

    modifiedNode = {
      ...ancestorNode,
      children: replaceChildren(ancestorNode.children, index, 1, modifiedNode),
    }
  }

  const index = slicedPath.pop()!
  editor.children = replaceChildren(editor.children, index, 1, modifiedNode)
}

/**
 * Replace the children of a node, replacing all ancestors
 */
const modifyChildren = (
  editor: Editor,
  path: Path,
  f: (children: Descendant[]) => Descendant[]
) => {
  if (path.length === 0) {
    editor.children = f(editor.children)
  } else {
    modifyDescendant<Element>(editor, path, node => {
      if (Text.isText(node)) {
        throw new Error(
          `Cannot get the element at path [${path}] because it refers to a leaf node: ${Scrubber.stringify(
            node
          )}`
        )
      }

      return { ...node, children: f(node.children) }
    })
  }
}

/**
 * Replace a leaf, replacing all ancestors
 */
const modifyLeaf = (editor: Editor, path: Path, f: (leaf: Text) => Text) =>
  modifyDescendant(editor, path, node => {
    if (!Text.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${Scrubber.stringify(
          node
        )}`
      )
    }

    return f(node)
  })

// eslint-disable-next-line no-redeclare
export const GeneralTransforms: GeneralTransforms = {
  transform(editor: Editor, op: Operation): void {
    let transformSelection = false

    switch (op.type) {
      case 'insert_node': {
        const { path, node } = op

        modifyChildren(editor, Path.parent(path), children => {
          const index = path[path.length - 1]

          if (index > children.length) {
            throw new Error(
              `Cannot apply an "insert_node" operation at path [${path}] because the destination is past the end of the node.`
            )
          }

          return insertChildren(children, index, node)
        })

        transformSelection = true
        break
      }

      case 'insert_text': {
        const { path, offset, text } = op
        if (text.length === 0) break

        modifyLeaf(editor, path, node => {
          const before = node.text.slice(0, offset)
          const after = node.text.slice(offset)

          return {
            ...node,
            text: before + text + after,
          }
        })

        transformSelection = true
        break
      }

      case 'merge_node': {
        const { path } = op
        const index = path[path.length - 1]
        const prevPath = Path.previous(path)
        const prevIndex = prevPath[prevPath.length - 1]

        modifyChildren(editor, Path.parent(path), children => {
          const node = children[index]
          const prev = children[prevIndex]
          let newNode: Descendant

          if (Text.isText(node) && Text.isText(prev)) {
            newNode = { ...prev, text: prev.text + node.text }
          } else if (!Text.isText(node) && !Text.isText(prev)) {
            newNode = { ...prev, children: prev.children.concat(node.children) }
          } else {
            throw new Error(
              `Cannot apply a "merge_node" operation at path [${path}] to nodes of different interfaces: ${Scrubber.stringify(
                node
              )} ${Scrubber.stringify(prev)}`
            )
          }

          return replaceChildren(children, prevIndex, 2, newNode)
        })

        transformSelection = true
        break
      }

      case 'move_node': {
        const { path, newPath } = op
        const index = path[path.length - 1]

        if (Path.isAncestor(path, newPath)) {
          throw new Error(
            `Cannot move a path [${path}] to new path [${newPath}] because the destination is inside itself.`
          )
        }

        const node = Node.get(editor, path)

        modifyChildren(editor, Path.parent(path), children =>
          removeChildren(children, index, 1)
        )

        // This is tricky, but since the `path` and `newPath` both refer to
        // the same snapshot in time, there's a mismatch. After either
        // removing the original position, the second step's path can be out
        // of date. So instead of using the `op.newPath` directly, we
        // transform `op.path` to ascertain what the `newPath` would be after
        // the operation was applied.
        const truePath = Path.transform(path, op)!
        const newIndex = truePath[truePath.length - 1]

        modifyChildren(editor, Path.parent(truePath), children =>
          insertChildren(children, newIndex, node)
        )

        transformSelection = true
        break
      }

      case 'remove_node': {
        const { path } = op
        const index = path[path.length - 1]

        modifyChildren(editor, Path.parent(path), children =>
          removeChildren(children, index, 1)
        )

        // Transform all the points in the value, but if the point was in the
        // node that was removed we need to update the range or remove it.
        if (editor.selection) {
          let selection: Selection = { ...editor.selection }

          for (const [point, key] of Range.points(selection)) {
            const result = Point.transform(point, op)

            if (selection != null && result != null) {
              selection[key] = result
            } else {
              let prev: NodeEntry<Text> | undefined
              let next: NodeEntry<Text> | undefined

              for (const [n, p] of Node.texts(editor)) {
                if (Path.compare(p, path) === -1) {
                  prev = [n, p]
                } else {
                  next = [n, p]
                  break
                }
              }

              let preferNext = false
              if (prev && next) {
                if (Path.isSibling(prev[1], path)) {
                  preferNext = false
                } else if (Path.equals(next[1], path)) {
                  preferNext = true
                } else {
                  preferNext =
                    Path.common(prev[1], path).length <
                    Path.common(next[1], path).length
                }
              }

              if (prev && !preferNext) {
                selection![key] = { path: prev[1], offset: prev[0].text.length }
              } else if (next) {
                selection![key] = { path: next[1], offset: 0 }
              } else {
                selection = null
              }
            }
          }

          if (!selection || !Range.equals(selection, editor.selection)) {
            editor.selection = selection
          }
        }

        break
      }

      case 'remove_text': {
        const { path, offset, text } = op
        if (text.length === 0) break

        modifyLeaf(editor, path, node => {
          const before = node.text.slice(0, offset)
          const after = node.text.slice(offset + text.length)

          return {
            ...node,
            text: before + after,
          }
        })

        transformSelection = true
        break
      }

      case 'set_node': {
        const { path, properties, newProperties } = op

        if (path.length === 0) {
          throw new Error(`Cannot set properties on the root node!`)
        }

        modifyDescendant(editor, path, node => {
          const newNode = { ...node }

          for (const key in newProperties) {
            if (key === 'children' || key === 'text') {
              throw new Error(`Cannot set the "${key}" property of nodes!`)
            }

            const value = newProperties[<keyof Node>key]

            if (value == null) {
              delete newNode[<keyof Node>key]
            } else {
              newNode[<keyof Node>key] = value
            }
          }

          // properties that were previously defined, but are now missing, must be deleted
          for (const key in properties) {
            if (!newProperties.hasOwnProperty(key)) {
              delete newNode[<keyof Node>key]
            }
          }

          return newNode
        })

        break
      }

      case 'set_selection': {
        const { newProperties } = op

        if (newProperties == null) {
          editor.selection = null
          break
        }

        if (editor.selection == null) {
          if (!Range.isRange(newProperties)) {
            throw new Error(
              `Cannot apply an incomplete "set_selection" operation properties ${Scrubber.stringify(
                newProperties
              )} when there is no current selection.`
            )
          }

          editor.selection = { ...newProperties }
          break
        }

        const selection = { ...editor.selection }

        for (const key in newProperties) {
          const value = newProperties[<keyof Range>key]

          if (value == null) {
            if (key === 'anchor' || key === 'focus') {
              throw new Error(`Cannot remove the "${key}" selection property`)
            }

            delete selection[<keyof Range>key]
          } else {
            selection[<keyof Range>key] = value
          }
        }

        editor.selection = selection

        break
      }

      case 'split_node': {
        const { path, position, properties } = op
        const index = path[path.length - 1]

        if (path.length === 0) {
          throw new Error(
            `Cannot apply a "split_node" operation at path [${path}] because the root node cannot be split.`
          )
        }

        modifyChildren(editor, Path.parent(path), children => {
          const node = children[index]
          let newNode: Descendant
          let nextNode: Descendant

          if (Text.isText(node)) {
            const before = node.text.slice(0, position)
            const after = node.text.slice(position)
            newNode = {
              ...node,
              text: before,
            }
            nextNode = {
              ...(properties as Partial<Text>),
              text: after,
            }
          } else {
            const before = node.children.slice(0, position)
            const after = node.children.slice(position)
            newNode = {
              ...node,
              children: before,
            }
            nextNode = {
              ...(properties as Partial<Element>),
              children: after,
            }
          }

          return replaceChildren(children, index, 1, newNode, nextNode)
        })

        transformSelection = true
        break
      }
    }

    if (transformSelection && editor.selection) {
      const selection = { ...editor.selection }

      for (const [point, key] of Range.points(selection)) {
        selection[key] = Point.transform(point, op)!
      }

      if (!Range.equals(selection, editor.selection)) {
        editor.selection = selection
      }
    }
  },
}
