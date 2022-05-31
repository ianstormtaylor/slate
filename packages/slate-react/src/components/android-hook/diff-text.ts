import { Editor, Node, Path, Point, Range, Text, Operation } from 'slate'

export type StringDiff = {
  start: number
  end: number
  insertText: string
}

export type TextDiff = {
  path: Path
  diff: StringDiff
}

export function verifyDiffState(editor: Editor, textDiff: TextDiff): boolean {
  const { path, diff } = textDiff
  if (!Editor.hasPath(editor, path)) {
    return false
  }

  const node = Node.get(editor, path)
  if (!Text.isText(node)) {
    return false
  }

  if (diff.start !== node.text.length || diff.insertText.length === 0) {
    return (
      node.text.slice(diff.start, diff.start + diff.insertText.length) ===
      diff.insertText
    )
  }

  const nextPath = Path.next(path)
  if (!Editor.hasPath(editor, nextPath)) {
    return false
  }

  const nextNode = Node.get(editor, nextPath)
  return Text.isText(nextNode) && nextNode.text.startsWith(diff.insertText)
}

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

export function targetRange(textDiff: TextDiff): Range {
  const { path, diff } = textDiff
  return {
    anchor: { path, offset: diff.start },
    focus: { path, offset: diff.end },
  }
}

function normalizePoint(editor: Editor, point: Point): Point | null {
  let { path, offset } = point
  let leaf = Node.leaf(editor, path)

  const parentBlock = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
    at: path,
  })

  if (!parentBlock) {
    return null
  }

  while (offset > leaf.text.length) {
    const entry = Editor.next(editor, { at: path, match: Text.isText })
    if (!entry || !Path.isDescendant(entry[1], parentBlock[1])) {
      return null
    }

    offset -= leaf.text.length
    leaf = entry[0]
    path = entry[1]
  }

  return { path, offset }
}

export function normalizeRange(editor: Editor, range: Range): Range | null {
  const anchor = normalizePoint(editor, range.anchor)
  if (!anchor) {
    return null
  }

  if (Range.isCollapsed(range)) {
    return { anchor, focus: anchor }
  }

  const focus = normalizePoint(editor, range.focus)
  if (!focus) {
    return null
  }

  return { anchor, focus }
}

// TODO: Standardize behavior, decide how we want to handle changes
export function transformTextDiff(
  textDiff: TextDiff,
  op: Operation
): TextDiff | null {
  const { path, diff } = textDiff

  switch (op.type) {
    case 'insert_text': {
      if (!Path.equals(op.path, path) || op.offset >= diff.end) {
        return textDiff
      }

      if (op.offset <= diff.start) {
        return {
          diff: {
            start: op.text.length + diff.start,
            end: op.text.length + diff.end,
            insertText: diff.insertText,
          },
          path,
        }
      }

      return null
    }
    case 'remove_text': {
      if (!Path.equals(op.path, path) || op.offset >= diff.end) {
        return textDiff
      }

      if (op.offset + op.text.length <= diff.start) {
        return {
          diff: {
            start: diff.start - op.text.length,
            end: diff.end - op.text.length,
            insertText: diff.insertText,
          },
          path,
        }
      }

      return null
    }
    case 'split_node': {
      if (Path.equals(op.path, path) || op.position >= diff.end) {
        return {
          diff,
          path: Path.transform(path, op)!,
        }
      }

      if (op.position > diff.start) {
        return null
      }

      return {
        diff: {
          start: diff.start - op.position,
          end: diff.end - op.position,
          insertText: diff.insertText,
        },
        path: Path.transform(path, op)!,
      }
    }
    case 'merge_node': {
      if (!Path.equals(op.path, path)) {
        return {
          diff,
          path: Path.transform(path, op)!,
        }
      }

      return {
        diff: {
          start: diff.start + op.position,
          end: diff.end + op.position,
          insertText: diff.insertText,
        },
        path: Path.transform(path, op)!,
      }
    }
  }

  const newPath = Path.transform(path, op)
  if (!newPath) {
    return null
  }

  return {
    diff,
    path: newPath,
  }
}
