import { Editor, Node, Point } from 'slate'
import { ReactEditor } from '../plugin/react-editor'

const caretTop = (editor: ReactEditor, point: Point) => {
  const range = ReactEditor.toDOMRange(editor, { anchor: point, focus: point })
  const [rect] = Array.from(range.getClientRects())
  return (rect ?? range.getBoundingClientRect()).top
}

export const getPointAboveTrailingNewline = (
  editor: ReactEditor,
  point: Point
): Point | null => {
  const block = Editor.above(editor, {
    at: point,
    match: n => Node.isElement(n) && Editor.isBlock(editor, n),
  })

  if (!block) {
    return null
  }

  const blockStart = Editor.start(editor, block[1])
  const before = Editor.before(editor, blockStart)

  if (!before || !Editor.leaf(editor, before)[0].text.endsWith('\n')) {
    return null
  }

  if (
    !Point.equals(point, blockStart) &&
    Math.abs(caretTop(editor, point) - caretTop(editor, blockStart)) > 2
  ) {
    return null
  }

  return before
}
