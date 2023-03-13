import { WithEditorFirstArg } from './utils/types'
import { Transforms } from './transforms'
import { Editor } from './interfaces/editor'

export const insertText: WithEditorFirstArg<Editor['insertText']> = (
  editor,
  text,
  options = {}
) => {
  const { selection, marks } = editor

  if (selection) {
    if (marks) {
      const node = { text, ...marks }
      Transforms.insertNodes(editor, node)
    } else {
      Transforms.insertText(editor, text)
    }

    editor.marks = null
  }
}
