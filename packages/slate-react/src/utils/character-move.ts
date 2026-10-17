import { Editor, Node, Path, Point } from 'slate'

export const getCharacterMoveUnit = (
  editor: Editor,
  point: Point,
  reverse: boolean
): 'character' | 'offset' => {
  const inline = Editor.above(editor, {
    at: point,
    match: node => Node.isElement(node) && editor.isInline(node),
  })

  if (
    !inline ||
    editor.isVoid(inline[0]) ||
    editor.isElementReadOnly(inline[0]) ||
    !(reverse
      ? Editor.isStart(editor, point, inline[1])
      : Editor.isEnd(editor, point, inline[1]))
  ) {
    return 'character'
  }

  if (reverse && !Path.hasPrevious(inline[1])) {
    return 'character'
  }

  const siblingPath = reverse ? Path.previous(inline[1]) : Path.next(inline[1])

  if (!Editor.hasPath(editor, siblingPath)) {
    return 'character'
  }

  const sibling = Node.get(editor, siblingPath)
  return Node.isText(sibling) && sibling.text === '' ? 'offset' : 'character'
}
