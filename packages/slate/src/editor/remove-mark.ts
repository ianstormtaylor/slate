import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'
import { Transforms } from '../interfaces/transforms'
import { FLUSHING } from '../utils/weak-maps'

export const removeMark: EditorInterface['removeMark'] = (editor, key) => {
  const { selection } = editor

  if (selection) {
    const match = (node: Node, path: Path) => {
      if (!Text.isText(node)) {
        return false // marks can only be applied to text
      }
      const parentPath = Editor.parent(editor, path)
      if (!parentPath) {
        return editor.onError({
          key: 'removeMark.match.parent',
          message: 'Cannot find the parent node',
          data: { path },
          recovery: false,
        })
      }
      const [parentNode] = parentPath

      return !editor.isVoid(parentNode) || editor.markableVoid(parentNode)
    }
    const expandedSelection = Range.isExpanded(selection)
    let markAcceptingVoidSelected = false
    if (!expandedSelection) {
      const entry = Editor.node(editor, selection)
      if (!entry) {
        return editor.onError({
          key: 'removeMark.node',
          message: 'Cannot find the node',
          data: { selection },
        })
      }

      const [selectedNode, selectedPath] = entry
      if (selectedNode && match(selectedNode, selectedPath)) {
        const parentEntry = Editor.parent(editor, selectedPath)
        if (!parentEntry) {
          return editor.onError({
            key: 'removeMark.parent',
            message: 'Cannot find the parent node',
            data: { selectedPath },
          })
        }
        const [parentNode] = parentEntry

        markAcceptingVoidSelected =
          parentNode && editor.markableVoid(parentNode)
      }
    }
    if (expandedSelection || markAcceptingVoidSelected) {
      Transforms.unsetNodes(editor, key, {
        match,
        split: true,
        voids: true,
      })
    } else {
      const marks = { ...(Editor.marks(editor) || {}) }
      delete marks[key]
      editor.marks = marks
      if (!FLUSHING.get(editor)) {
        editor.onChange()
      }
    }
  }
}
