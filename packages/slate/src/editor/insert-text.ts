import { Transforms } from '../interfaces/transforms'
import { Point } from '../interfaces/point'
import { Range } from '../interfaces/range'
import { Editor, EditorInterface } from '../interfaces/editor'

export const insertText: EditorInterface['insertText'] = (
  editor,
  text,
  options = {}
) => {
  const { selection, marks } = editor

  if (options.at != null) {
    Transforms.insertText(editor, text, options)
    return
  }

  if (selection) {
    if (Range.isCollapsed(selection)) {
      const point = Editor.insertionPoint(editor, selection.anchor)
      if (!Point.equals(point, selection.anchor))
        Transforms.select(editor, point)
    }
    if (marks) {
      const node = { text, ...marks }
      Transforms.insertNodes(editor, node, { voids: options.voids })
    } else {
      Transforms.insertText(editor, text, options)
    }

    editor.marks = null
  }
}
