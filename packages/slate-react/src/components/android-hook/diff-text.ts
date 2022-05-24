import { Editor, Point, Node, Text, Range, Path } from 'slate'

export type StringDiff = {
  start: number
  end: number
  insertText: string
}

type TextDiff = { path: Path; diff: StringDiff }

function applyStringDiff(text: string, ...diffs: StringDiff[]) {
  return diffs.reduce(
    (text, diff) =>
      text.slice(0, diff.start) + diff.insertText + text.slice(diff.end),
    text
  )
}

export function mergeStringDiffs(
  text: string,
  a: StringDiff,
  b: StringDiff
): StringDiff {
  const start = Math.min(a.start, b.start)
  const overlap = Math.max(
    0,
    Math.min(a.start + a.insertText.length, b.end) - b.start
  )

  const applied = applyStringDiff(text, a, b)
  const sliceEnd = Math.max(
    b.start + b.insertText.length,
    a.start +
      a.insertText.length +
      (a.start + a.insertText.length > b.start ? b.insertText.length : 0) -
      overlap
  )

  return {
    start,
    end: Math.max(a.end, b.end - a.insertText.length + (a.end - a.start)),
    insertText: applied.slice(start, sliceEnd),
  }
}

export function targetRange(editor: Editor, textDiff: TextDiff): Range {
  const { path, diff } = textDiff
  const range = {
    anchor: { path, offset: diff.start },
    focus: { path, offset: diff.end },
  }

  return normalizeRange(editor, range)
}

function normalizePoint(editor: Editor, point: Point) {
  let { path, offset } = point
  let leaf = Node.leaf(editor, path)

  while (offset > leaf.text.length) {
    const entry = Editor.next(editor, { at: path, match: Text.isText })
    if (!entry) {
      throw new Error('Cannot normalize point')
    }

    offset -= leaf.text.length
    leaf = entry[0]
    path = entry[1]
  }

  return { path, offset }
}

export function normalizeRange(editor: Editor, range: Range): Range {
  const anchor = normalizePoint(editor, range.anchor)
  if (Range.isCollapsed(range)) {
    return { anchor, focus: anchor }
  }

  return { anchor, focus: normalizePoint(editor, range.focus) }
}
