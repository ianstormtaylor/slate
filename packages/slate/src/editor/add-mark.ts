import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Text } from '../interfaces/text'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { FLUSHING } from '../utils/weak-maps'
import { Editor, EditorInterface } from '../interfaces/editor'

export const addMark: EditorInterface['addMark'] = (editor, key, value) => {
  const { selection } = editor

  if (selection) {
    const match = (node: Node, path: Path) => {
      if (!Text.isText(node)) {
        return false // marks can only be applied to text
      }
      const parentEntry = Editor.parent(editor, path)
      if (!parentEntry) return false

      const [parentNode] = parentEntry

      return !editor.isVoid(parentNode) || editor.markableVoid(parentNode)
    }
    const expandedSelection = Range.isExpanded(selection)
    let markAcceptingVoidSelected = false
    if (!expandedSelection) {
      const selectedEntry = Editor.node(editor, selection)
      if (!selectedEntry) return

      const [selectedNode, selectedPath] = selectedEntry

      if (selectedNode && match(selectedNode, selectedPath)) {
        const parentEntry = Editor.parent(editor, selectedPath)
        if (!parentEntry) return

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
