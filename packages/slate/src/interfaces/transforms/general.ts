import {
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
import { MUTATED_CHILD_ARRAYS_IN_BATCH } from '../../utils'
import {
  modifyChildren,
  modifyDescendant,
  modifyLeaf,
  smartInsertChildren,
  smartRemoveChildren,
  smartReplaceChildren,
} from '../../utils/modify'

/**
 * The set of properties that cannot be set using set_node.
 */
export const NON_SETTABLE_NODE_PROPERTIES = [
  'children',
  'text',
  // Do not allow overriding any property on the Object prototype
  ...Object.getOwnPropertyNames(Object.prototype),
]

/**
 * The set of properties that cannot be set using set_selection.
 */
export const NON_SETTABLE_SELECTION_PROPERTIES = Object.getOwnPropertyNames(
  Object.prototype
)

export interface GeneralTransforms {
  /**
   * Transform the editor by an operation.
   */
  transform: (editor: Editor, op: Operation) => void
}

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
          const modifiedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(editor)
          return smartInsertChildren(modifiedChildArrays, children, index, node)
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
        if (!Path.hasPrevious(path)) {
          throw new Error(
            `Cannot apply a "merge_node" operation at path [${path}] because it has no previous sibling.`
          )
        }
        const index = path[path.length - 1]
        const prevIndex = index - 1

        if (path.length === 0) {
          throw new Error(
            `Cannot apply a "merge_node" operation at path [${path}] because the root node cannot be merged.`
          )
        }

        // Defend against malicious paths containing strings
        if (typeof index !== 'number' || typeof prevIndex !== 'number')
          throw new Error('Index must be number')

        modifyChildren(editor, Path.parent(path), children => {
          const node = children[index]
          const prev = children[prevIndex]
          let newNode: Descendant

          const modifiedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(editor)

          if (Node.isText(node) && Node.isText(prev)) {
            newNode = { ...prev, text: prev.text + node.text }
          } else if (Node.isElement(node) && Node.isElement(prev)) {
            if (modifiedChildArrays?.has(prev.children)) {
              // modify child array in place
              prev.children.push(...node.children)
              // we can infer that children is mutable because its an ancestor of prev.children. Just mutate in place
              children.splice(index, 1)
              return children
            } else {
              newNode = {
                ...prev,
                children: prev.children.concat(node.children),
              }
              modifiedChildArrays?.add(newNode.children)
            }
            newNode = { ...prev, children: prev.children.concat(node.children) }
          } else {
            throw new Error(
              `Cannot apply a "merge_node" operation at path [${path}] to nodes of different interfaces: ${Scrubber.stringify(
                node
              )} ${Scrubber.stringify(prev)}`
            )
          }

          return smartReplaceChildren(
            modifiedChildArrays,
            children,
            prevIndex,
            2,
            newNode
          )
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
        const modifiedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(editor)

        modifyChildren(editor, Path.parent(path), children =>
          smartRemoveChildren(modifiedChildArrays, children, index, 1)
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
          smartInsertChildren(modifiedChildArrays, children, newIndex, node)
        )

        transformSelection = true
        break
      }

      case 'remove_node': {
        const { path } = op
        const index = path[path.length - 1]
        const modifiedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(editor)

        modifyChildren(editor, Path.parent(path), children =>
          smartRemoveChildren(modifiedChildArrays, children, index, 1)
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
            if (NON_SETTABLE_NODE_PROPERTIES.includes(key)) {
              throw new Error(`Cannot set the "${key}" property of nodes!`)
            }

            const value = newProperties[<keyof Node>key]

            // Make sure we're not setting `then` to a function, since this will
            // cause the node to be treated as a Promise-like object, which can
            // cause unexpected behaviour when returning the node from async
            // functions.
            if (key === 'then' && typeof value === 'function') {
              throw new Error(
                'Cannot set the "then" property of a node to a function'
              )
            }

            if (value == null) {
              delete newNode[<keyof Node>key]
            } else {
              newNode[<keyof Node>key] = value
            }
          }

          // properties that were previously defined, but are now missing, must be deleted
          for (const key in properties) {
            if (!Object.hasOwn(newProperties, key)) {
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
          if (!(newProperties.anchor && newProperties.focus)) {
            throw new Error(
              `Cannot apply an incomplete "set_selection" operation properties ${Scrubber.stringify(
                newProperties
              )} when there is no current selection.`
            )
          }

          editor.selection = { ...(newProperties as Range) }
          break
        }

        const selection = { ...editor.selection }

        for (const key in newProperties) {
          if (NON_SETTABLE_SELECTION_PROPERTIES.includes(key)) {
            throw new Error(
              `Cannot set the "${key}" property of the selection!`
            )
          }

          const value = newProperties[<keyof Range>key]

          // Make sure we're not setting `then` to a function, since this will
          // cause the selection to be treated as a Promise-like object, which
          // can cause unexpected behaviour when returning the selection from
          // async functions.
          if (key === 'then' && typeof value === 'function') {
            throw new Error(
              'Cannot set the "then" property of the selection to a function'
            )
          }

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

        // Defend against malicious paths containing strings
        if (typeof index !== 'number') throw new Error('Index must be number')

        // defend against malicious properties
        for (const key in properties) {
          if (NON_SETTABLE_NODE_PROPERTIES.includes(key)) {
            throw new Error(`Cannot set the "${key}" property of nodes!`)
          }

          const value = properties[<keyof Node>key]

          // Make sure we're not setting `then` to a function, since this will
          // cause the node to be treated as a Promise-like object, which can
          // cause unexpected behaviour when returning the node from async
          // functions.
          if (key === 'then' && typeof value === 'function') {
            throw new Error(
              'Cannot set the "then" property of a node to a function'
            )
          }
        }
        if (Object.getOwnPropertySymbols(properties).length !== 0) {
          throw new Error(`Cannot set symbol properties of nodes!`)
        }

        modifyChildren(editor, Path.parent(path), children => {
          const node = children[index]
          let newNode: Descendant
          let nextNode: Descendant

          const modifiedChildArrays = MUTATED_CHILD_ARRAYS_IN_BATCH.get(editor)

          if (Node.isText(node)) {
            const before = node.text.slice(0, position)
            const after = node.text.slice(position)
            newNode = {
              ...node,
              text: before,
            }
            nextNode = {
              ...(properties as Partial<Element>),
              text: after,
            }
          } else {
            if (modifiedChildArrays?.has(node.children)) {
              // modify child array in place by splicing
              const after = node.children.splice(position)
              nextNode = {
                ...(properties as Partial<Element>),
                children: after,
              }
              modifiedChildArrays.add(after)
              // we can infer that children is mutable because its an ancestor of prev.children. Just mutate in place
              children.splice(index + 1, 0, nextNode)
              return children
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
              if (modifiedChildArrays) {
                modifiedChildArrays.add(before)
                modifiedChildArrays.add(after)
              }
            }
          }

          return smartReplaceChildren(
            modifiedChildArrays,
            children,
            index,
            1,
            newNode,
            nextNode
          )
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
