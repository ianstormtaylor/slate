import { Editor, Node, Point } from 'slate'
import { ReactEditor } from '../plugin/react-editor'

const caretTop = (editor: ReactEditor, point: Point) => {
  const range = ReactEditor.resolveDOMRange(editor, {
    anchor: point,
    focus: point,
  })

  if (!range) {
    return null
  }

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

  if (Point.equals(point, blockStart)) {
    return before
  }

  const pointTop = caretTop(editor, point)
  const blockStartTop = caretTop(editor, blockStart)

  if (pointTop === null || blockStartTop === null) {
    return null
  }

  return Math.abs(pointTop - blockStartTop) > 2 ? null : before
}
