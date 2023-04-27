import { createDraft, finishDraft, isDraft } from 'immer'
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

const applyToDraft = (editor: Editor, selection: Selection, op: Operation) => {
  switch (op.type) {
    case 'insert_node': {
      const { path, node } = op
      const parent = Node.parent(editor, path)
      if (!parent) {
        editor.onError({
          type: 'insert_node',
          message: `Cannot apply an "insert_node" operation at path [${path}] because it has no parent.`,
        })
        return selection
      }

      const index = path[path.length - 1]

      if (index > parent.children.length) {
        editor.onError({
          type: 'insert_node',
          message: `Cannot apply an "insert_node" operation at path [${path}] because the destination is past the end of the node.`,
        })
        return selection
      }

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
      if (text.length === 0) break
      const node = Node.leaf(editor, path)
      if (!node) {
        editor.onError({
          type: 'insert_text',
          message: `Cannot apply an "insert_text" operation at path [${path}] because it could not be found.`,
        })
        return selection
      }

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
      if (!node) {
        editor.onError({
          type: 'merge_node',
          message: `Cannot apply a "merge_node" operation at path [${path}] because it could not be found.`,
        })
        return selection
      }

      const prevPath = Path.previous(path)
      if (!prevPath) {
        editor.onError({
          type: 'merge_node',
          message: `Cannot apply a "merge_node" operation at path [${path}] because it has no previous sibling.`,
        })
        return selection
      }

      const prev = Node.get(editor, prevPath)
      if (!prev) {
        editor.onError({
          type: 'merge_node',
          message: `Cannot apply a "merge_node" operation at path [${path}] because its previous sibling could not be found.`,
        })
        return selection
      }

      const parent = Node.parent(editor, path)
      if (!parent) {
        editor.onError({
          type: 'merge_node',
          message: `Cannot apply a "merge_node" operation at path [${path}] because it has no parent.`,
        })
        return selection
      }

      const index = path[path.length - 1]

      if (Text.isText(node) && Text.isText(prev)) {
        prev.text += node.text
      } else if (!Text.isText(node) && !Text.isText(prev)) {
        prev.children.push(...node.children)
      } else {
        editor.onError({
          type: 'merge_node',
          message: `Cannot apply a "merge_node" operation at path [${path}] to nodes of different interfaces: ${Scrubber.stringify(
            node
          )} ${Scrubber.stringify(prev)}`,
        })
        return selection
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
        editor.onError({
          type: 'move_node',
          message: `Cannot move a path [${path}] to new path [${newPath}] because the destination is inside itself.`,
        })
        return selection
      }

      const node = Node.get(editor, path)
      if (!node) {
        editor.onError({
          type: 'move_node',
          message: `Cannot apply a "move_node" operation at path [${path}] because it could not be found.`,
        })
        return selection
      }

      const parent = Node.parent(editor, path)
      if (!parent) {
        editor.onError({
          type: 'move_node',
          message: `Cannot apply a "move_node" operation at path [${path}] because it has no parent.`,
        })
        return selection
      }

      const index = path[path.length - 1]

      // This is tricky, but since the `path` and `newPath` both refer to
      // the same snapshot in time, there's a mismatch. After either
      // removing the original position, the second step's path can be out
      // of date. So instead of using the `op.newPath` directly, we
      // transform `op.path` to ascertain what the `newPath` would be after
      // the operation was applied.
      parent.children.splice(index, 1)
      const truePath = Path.transform(path, op)!

      const newParentPath = Path.parent(truePath)
      if (!newParentPath) {
        editor.onError({
          type: 'move_node',
          message: `Cannot apply a "move_node" operation at path [${path}] because it has no parent.`,
        })
        return selection
      }

      const newParent = Node.get(editor, newParentPath) as Ancestor
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
      if (!parent) {
        editor.onError({
          type: 'remove_node',
          message: `Cannot apply a "remove_node" operation at path [${path}] because it has no parent.`,
        })
        return selection
      }

      parent.children.splice(index, 1)

      // Transform all of the points in the value, but if the point was in the
      // node that was removed we need to update the range or remove it.
      if (selection) {
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
              if (Path.equals(next[1], path)) {
                preferNext = !Path.hasPrevious(next[1])
              } else {
                preferNext =
                  Path.common(prev[1], path).length <
                  Path.common(next[1], path).length
              }
            }

            if (prev && !preferNext) {
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

      break
    }

    case 'remove_text': {
      const { path, offset, text } = op
      if (text.length === 0) break
      const node = Node.leaf(editor, path)
      if (!node) {
        editor.onError({
          type: 'remove_text',
          message: `Cannot apply a "remove_text" operation at path [${path}] because it could not be found.`,
        })
        return selection
      }

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
      const { path, properties, newProperties } = op

      if (path.length === 0) {
        editor.onError({
          type: 'set_node',
          message: `Cannot set properties on the root node!`,
        })
        return selection
      }

      const node = Node.get(editor, path)
      if (!node) {
        editor.onError({
          type: 'set_node',
          message: `Cannot apply a "set_node" operation at path [${path}] because it could not be found.`,
        })
        return selection
      }

      for (const key in newProperties) {
        if (key === 'children' || key === 'text') {
          editor.onError({
            type: 'set_node',
            message: `Cannot set the "${key}" property of nodes!`,
          })
          return selection
        }

        const value = newProperties[key]

        if (value == null) {
          delete node[key]
        } else {
          node[key] = value
        }
      }

      // properties that were previously defined, but are now missing, must be deleted
      for (const key in properties) {
        if (!newProperties.hasOwnProperty(key)) {
          delete node[key]
        }
      }

      break
    }

    case 'set_selection': {
      const { newProperties } = op

      if (newProperties == null) {
        selection = newProperties
      } else {
        if (selection == null) {
          if (!Range.isRange(newProperties)) {
            editor.onError({
              type: 'set_selection',
              message: `Cannot apply an incomplete "set_selection" operation properties ${Scrubber.stringify(
                newProperties
              )} when there is no current selection.`,
            })
            return selection
          }

          selection = { ...newProperties }
        }

        for (const key in newProperties) {
          const value = newProperties[key]

          if (value == null) {
            if (key === 'anchor' || key === 'focus') {
              editor.onError({
                type: 'set_selection',
                message: `Cannot remove the "${key}" selection property`,
              })
              return selection
            }

            delete selection[key]
          } else {
            selection[key] = value
          }
        }
      }

      break
    }

    case 'split_node': {
      const { path, position, properties } = op

      if (path.length === 0) {
        editor.onError({
          type: 'split_node',
          message: `Cannot apply a "split_node" operation at path [${path}] because the root node cannot be split.`,
        })
        return selection
      }

      const node = Node.get(editor, path)
      if (!node) {
        editor.onError({
          type: 'split_node',
          message: `Cannot apply a "split_node" operation at path [${path}] because it could not be found.`,
        })
        return selection
      }

      const parent = Node.parent(editor, path)
      if (!parent) {
        editor.onError({
          type: 'split_node',
          message: `Cannot apply a "split_node" operation at path [${path}] because it has no parent.`,
        })
        return selection
      }

      const index = path[path.length - 1]
      let newNode: Descendant

      if (Text.isText(node)) {
        const before = node.text.slice(0, position)
        const after = node.text.slice(position)
        node.text = before
        newNode = {
          ...(properties as Partial<Text>),
          text: after,
        }
      } else {
        const before = node.children.slice(0, position)
        const after = node.children.slice(position)
        node.children = before

        newNode = {
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
  return selection
}

// eslint-disable-next-line no-redeclare
export const GeneralTransforms: GeneralTransforms = {
  transform(editor: Editor, op: Operation): void {
    editor.children = createDraft(editor.children)
    let selection = editor.selection && createDraft(editor.selection)

    try {
      selection = applyToDraft(editor, selection, op)
    } finally {
      editor.children = finishDraft(editor.children)

      if (selection) {
        editor.selection = isDraft(selection)
          ? (finishDraft(selection) as Range)
          : selection
      } else {
        editor.selection = null
      }
    }
  },
}
