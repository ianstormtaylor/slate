import { Editor, Node, Operation, Path, Point, Range, Text } from 'slate'
import { EDITOR_TO_PENDING_DIFFS } from '../../utils/weak-maps'

export type StringDiff = {
  start: number
  end: number
  text: string
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

  if (diff.start !== node.text.length || diff.text.length === 0) {
    return (
      node.text.slice(diff.start, diff.start + diff.text.length) === diff.text
    )
  }

  const nextPath = Path.next(path)
  if (!Editor.hasPath(editor, nextPath)) {
    return false
  }

  const nextNode = Node.get(editor, nextPath)
  return Text.isText(nextNode) && nextNode.text.startsWith(diff.text)
}

function applyStringDiff(text: string, ...diffs: StringDiff[]) {
  return diffs.reduce(
    (text, diff) =>
      text.slice(0, diff.start) + diff.text + text.slice(diff.end),
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
    Math.min(a.start + a.text.length, b.end) - b.start
  )

  const applied = applyStringDiff(text, a, b)
  const sliceEnd = Math.max(
    b.start + b.text.length,
    a.start +
      a.text.length +
      (a.start + a.text.length > b.start ? b.text.length : 0) -
      overlap
  )

  return {
    start,
    end: Math.max(a.end, b.end - a.text.length + (a.end - a.start)),
    text: applied.slice(start, sliceEnd),
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

export function transformPendingPoint(
  editor: Editor,
  point: Point,
  op: Operation
): Point | null {
  const pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor)
  const textDiff = pendingDiffs?.find(({ path }) =>
    Path.equals(path, point.path)
  )

  if (!textDiff || point.offset <= textDiff.diff.start) {
    return Point.transform(point, op)
  }

  const { diff } = textDiff
  // Point references location inside the diff => transform the point based on the location
  // the diff will be applied to and add the offset inside the diff.
  if (point.offset <= diff.start + diff.text.length) {
    const anchor = { path: point.path, offset: diff.start }
    const transformed = Point.transform(anchor, op, {
      affinity: 'backward',
    })

    if (!transformed) {
      return null
    }

    return {
      path: transformed.path,
      offset: transformed.offset + point.offset - diff.start,
    }
  }

  // Point references location after the diff
  const anchor = {
    path: point.path,
    offset: point.offset - diff.text.length + diff.end - diff.start,
  }
  const transformed = Point.transform(anchor, op, {
    affinity: 'backward',
  })
  if (!transformed) {
    return null
  }

  // TODO: Fix condition?
  if (
    op.type === 'split_node' &&
    Path.equals(op.path, point.path) &&
    anchor.offset < op.position &&
    diff.start < op.position
  ) {
    return transformed
  }

  return {
    path: transformed.path,
    offset: transformed.offset + diff.text.length + diff.end - diff.start,
  }
}

export function transformPendingRange(
  editor: Editor,
  range: Range,
  op: Operation
): Range | null {
  const anchor = transformPendingPoint(editor, range.anchor, op)
  if (!anchor) {
    return null
  }

  if (Range.isCollapsed(range)) {
    return { anchor, focus: anchor }
  }

  const focus = transformPendingPoint(editor, range.focus, op)
  if (!focus) {
    return null
  }

  return { anchor, focus }
}

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
            text: diff.text,
          },
          path,
        }
      }

      return {
        diff: {
          start: diff.start,
          end: diff.end + op.text.length,
          text: diff.text,
        },
        path,
      }
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
            text: diff.text,
          },
          path,
        }
      }

      return {
        diff: {
          start: diff.start,
          end: diff.end - op.text.length,
          text: diff.text,
        },
        path,
      }
    }
    case 'split_node': {
      if (!Path.equals(op.path, path) || op.position >= diff.end) {
        return {
          diff,
          path: Path.transform(path, op, { affinity: 'backward' })!,
        }
      }

      if (op.position > diff.start) {
        return {
          diff: {
            start: diff.start,
            end: Math.min(op.position, diff.end),
            text: diff.text,
          },
          path,
        }
      }

      return {
        diff: {
          start: diff.start - op.position,
          end: diff.end - op.position,
          text: diff.text,
        },
        path: Path.transform(path, op, { affinity: 'forward' })!,
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
          text: diff.text,
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