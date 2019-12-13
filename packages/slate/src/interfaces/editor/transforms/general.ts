import { createDraft, finishDraft, isDraft } from 'immer'
import {
  Node,
  Editor,
  Range,
  Point,
  Text,
  Element,
  Operation,
  Descendant,
  Path,
} from '../../..'
import { TextEntry } from '../../text'

export const DIRTY_PATHS: WeakMap<Editor, Path[]> = new WeakMap()

export const GeneralTransforms = {
  /**
   * Normalize any dirty objects in the editor.
   */

  normalize(
    editor: Editor,
    options: {
      force?: boolean
    } = {}
  ) {
    const { force = false } = options

    if (!Editor.isNormalizing(editor)) {
      return
    }

    if (force) {
      const allPaths = Array.from(Node.nodes(editor), ([, p]) => p)
      DIRTY_PATHS.set(editor, allPaths)
    }

    if (getDirtyPaths(editor).length === 0) {
      return
    }

    Editor.withoutNormalizing(editor, () => {
      const max = getDirtyPaths(editor).length * 42 // HACK: better way?
      let m = 0

      while (getDirtyPaths(editor).length !== 0) {
        if (m > max) {
          throw new Error(`
            Could not completely normalize the editor after ${max} iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.
          `)
        }

        const path = getDirtyPaths(editor).pop()!
        const entry = Editor.node(editor, path)
        editor.normalizeNode(entry)
        m++
      }
    })
  },

  /**
   * Transform the editor by an operation.
   */

  transform(editor: Editor, op: Operation) {
    editor.children = createDraft(editor.children)
    let selection = editor.selection && createDraft(editor.selection)

    switch (op.type) {
      case 'insert_node': {
        const { path, node } = op
        const parent = Node.parent(editor, path)
        const index = path[path.length - 1]
        parent.children.splice(index, 0, node)

        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op)!
          }
        }

        break
      }

      case 'insert_text': {
        const { path, offset, text } = op
        const node = Node.leaf(editor, path)
        const before = node.text.slice(0, offset)
        const after = node.text.slice(offset)
        node.text = before + text + after

        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op)!
          }
        }

        break
      }

      case 'merge_node': {
        const { path } = op
        const node = Node.get(editor, path)
        const prevPath = Path.previous(path)
        const prev = Node.get(editor, prevPath)
        const parent = Node.parent(editor, path)
        const index = path[path.length - 1]

        if (Text.isText(node) && Text.isText(prev)) {
          prev.text += node.text
        } else if (!Text.isText(node) && !Text.isText(prev)) {
          prev.children.push(...node.children)
        } else {
          throw new Error(
            `Cannot apply a "merge_node" operation at path [${path}] to nodes of different interaces: ${node} ${prev}`
          )
        }

        parent.children.splice(index, 1)

        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op)!
          }
        }

        break
      }

      case 'move_node': {
        const { path, newPath } = op

        if (Path.isAncestor(path, newPath)) {
          throw new Error(
            `Cannot move a path [${path}] to new path [${newPath}] because the destination is inside itself.`
          )
        }

        const node = Node.get(editor, path)
        const parent = Node.parent(editor, path)
        const index = path[path.length - 1]

        // This is tricky, but since the `path` and `newPath` both refer to
        // the same snapshot in time, there's a mismatch. After either
        // removing the original position, the second step's path can be out
        // of date. So instead of using the `op.newPath` directly, we
        // transform `op.path` to ascertain what the `newPath` would be after
        // the operation was applied.
        parent.children.splice(index, 1)
        const truePath = Path.transform(path, op)!
        const newParent = Node.get(editor, Path.parent(truePath))
        const newIndex = truePath[truePath.length - 1]

        newParent.children.splice(newIndex, 0, node)

        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op)!
          }
        }

        break
      }

      case 'remove_node': {
        const { path } = op
        const index = path[path.length - 1]
        const parent = Node.parent(editor, path)
        parent.children.splice(index, 1)

        // Transform all of the points in the value, but if the point was in the
        // node that was removed we need to update the range or remove it.
        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            const result = Point.transform(point, op)

            if (selection != null && result != null) {
              selection[key] = result
            } else {
              let found = false
              let prev: TextEntry | undefined
              let next: TextEntry | undefined

              for (const [n, p] of Node.texts(editor)) {
                if (Path.compare(p, path) === -1) {
                  prev = [n, p]
                } else {
                  next = [n, p]
                  break
                }
              }

              if (!found) {
                if (prev) {
                  point.path = prev[1]
                  point.offset = prev[0].text.length
                } else if (next) {
                  point.path = next[1]
                  point.offset = 0
                } else {
                  selection = null
                }
              }
            }
          }
        }

        break
      }

      case 'remove_text': {
        const { path, offset, text } = op
        const node = Node.leaf(editor, path)
        const before = node.text.slice(0, offset)
        const after = node.text.slice(offset + text.length)
        node.text = before + after

        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op)!
          }
        }

        break
      }

      case 'set_node': {
        const { path, newProperties } = op

        if (path.length === 0) {
          throw new Error(`Cannot set properties on the root node!`)
        }

        const node = Node.get(editor, path)

        for (const key in newProperties) {
          if (key === 'children' || key === 'text') {
            throw new Error(`Cannot set the "${key}" property of nodes!`)
          }

          const value = newProperties[key]

          if (value == null) {
            delete node[key]
          } else {
            node[key] = value
          }
        }

        break
      }

      case 'set_selection': {
        const { newProperties } = op

        if (newProperties == null) {
          selection = newProperties
        } else if (selection == null) {
          if (!Range.isRange(newProperties)) {
            throw new Error(
              `Cannot apply an incomplete "set_selection" operation properties ${JSON.stringify(
                newProperties
              )} when there is no current selection.`
            )
          }

          selection = newProperties
        } else {
          Object.assign(selection, newProperties)
        }

        break
      }

      case 'split_node': {
        const { path, position, properties } = op

        if (path.length === 0) {
          throw new Error(
            `Cannot apply a "split_node" operation at path [${path}] because the root node cannot be split.`
          )
        }

        const node = Node.get(editor, path)
        const parent = Node.parent(editor, path)
        const index = path[path.length - 1]
        let newNode: Descendant

        if (Text.isText(node)) {
          const before = node.text.slice(0, position)
          const after = node.text.slice(position)
          node.text = before
          newNode = {
            ...node,
            ...(properties as Partial<Text>),
            text: after,
          }
        } else {
          const before = node.children.slice(0, position)
          const after = node.children.slice(position)
          node.children = before

          newNode = {
            ...node,
            ...(properties as Partial<Element>),
            children: after,
          }
        }

        parent.children.splice(index + 1, 0, newNode)

        if (selection) {
          for (const [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op)!
          }
        }

        break
      }
    }

    editor.children = finishDraft(editor.children) as Node[]

    if (selection) {
      editor.selection = isDraft(selection)
        ? (finishDraft(selection) as Range)
        : selection
    } else {
      editor.selection = null
    }
  },
}

const getDirtyPaths = (editor: Editor) => {
  return DIRTY_PATHS.get(editor) || []
}
