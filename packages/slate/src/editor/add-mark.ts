import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'
import { Transforms } from '../interfaces/transforms'
import { FLUSHING } from '../utils/weak-maps'

export const addMark: EditorInterface['addMark'] = (editor, key, value) => {
  const { selection } = editor

  if (selection) {
    const match = (node: Node, path: Path) => {
      if (!Text.isText(node)) {
        return false // marks can only be applied to text
      }
      const parentEntry = Editor.parent(editor, path)
      if (!parentEntry) {
        return editor.onError({
          key: 'addMark.match.parent',
          message: 'Cannot find the parent node of the current selection',
          data: { path },
          recovery: false,
        })
      }

      const [parentNode] = parentEntry

      return !editor.isVoid(parentNode) || editor.markableVoid(parentNode)
    }
    const expandedSelection = Range.isExpanded(selection)
    let markAcceptingVoidSelected = false
    if (!expandedSelection) {
      const selectedEntry = Editor.node(editor, selection)
      if (!selectedEntry) {
        editor.onError({
          key: 'addMark.node',
          message: 'Cannot find the selected node',
          data: { selection },
        })
        return
      }

      const [selectedNode, selectedPath] = selectedEntry

      if (selectedNode && match(selectedNode, selectedPath)) {
        const parentEntry = Editor.parent(editor, selectedPath)
        if (!parentEntry) {
          editor.onError({
            key: 'addMark.parent',
            message: 'Cannot find the parent node of the current selection',
            data: { path: selectedPath },
          })
          return
        }

        const [parentNode] = parentEntry

        markAcceptingVoidSelected =
          parentNode && editor.markableVoid(parentNode)
      }
    }
    if (expandedSelection || markAcceptingVoidSelected) {
      Transforms.setNodes(
        editor,
        { [key]: value },
        {
          match,
          split: true,
          voids: true,
        }
      )
    } else {
      const marks = {
        ...(Editor.marks(editor) || {}),
        [key]: value,
      }

      editor.marks = marks
      if (!FLUSHING.get(editor)) {
        editor.onChange()
      }
    }
  }
}
