import {
  Editor,
  Node,
  Operation,
  Path,
  Point,
  Range,
  Text,
  Element,
} from 'slate'
import { EDITOR_TO_PENDING_DIFFS } from './weak-maps'

export type StringDiff = {
  start: number
  end: number
  text: string
}

export type TextDiff = {
  id: number
  path: Path
  diff: StringDiff
}

/**
 * Check whether a text diff was applied in a way we can perform the pending action on /
 * recover the pending selection.
 */
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

export function applyStringDiff(text: string, ...diffs: StringDiff[]) {
  return diffs.reduce(
    (text, diff) =>
      text.slice(0, diff.start) + diff.text + text.slice(diff.end),
    text
  )
}

function longestCommonPrefixLength(str: string, another: string) {
  const length = Math.min(str.length, another.length)

  for (let i = 0; i < length; i++) {
    if (str.charAt(i) !== another.charAt(i)) {
      return i
    }
  }

  return length
}

function longestCommonSuffixLength(
  str: string,
  another: string,
  max: number
): number {
  const length = Math.min(str.length, another.length, max)

  for (let i = 0; i < length; i++) {
    if (
      str.charAt(str.length - i - 1) !== another.charAt(another.length - i - 1)
    ) {
      return i
    }
  }

  return length
}

/**
 * Remove redundant changes from the diff so that it spans the minimal possible range
 */
export function normalizeStringDiff(targetText: string, diff: StringDiff) {
  const { start, end, text } = diff
  const removedText = targetText.slice(start, end)

  const prefixLength = longestCommonPrefixLength(removedText, text)
  const max = Math.min(
    removedText.length - prefixLength,
    text.length - prefixLength
  )
  const suffixLength = longestCommonSuffixLength(removedText, text, max)

  const normalized: StringDiff = {
    start: start + prefixLength,
    end: end - suffixLength,
    text: text.slice(prefixLength, text.length - suffixLength),
  }

  if (normalized.start === normalized.end && normalized.text.length === 0) {
    return null
  }

  return normalized
}

/**
 * Return a string diff that is equivalent to applying b after a spanning the range of
 * both changes
 */
export function mergeStringDiffs(
  targetText: string,
  a: StringDiff,
  b: StringDiff
): StringDiff | null {
  const start = Math.min(a.start, b.start)
  const overlap = Math.max(
    0,
    Math.min(a.start + a.text.length, b.end) - b.start
  )

  const applied = applyStringDiff(targetText, a, b)
  const sliceEnd = Math.max(
    b.start + b.text.length,
    a.start +
      a.text.length +
      (a.start + a.text.length > b.start ? b.text.length : 0) -
      overlap
  )

  const text = applied.slice(start, sliceEnd)
  const end = Math.max(a.end, b.end - a.text.length + (a.end - a.start))
  return normalizeStringDiff(targetText, { start, end, text })
}

/**
 * Get the slate range the text diff spans.
 */
export function targetRange(textDiff: TextDiff): Range {
  const { path, diff } = textDiff
  return {
    anchor: { path, offset: diff.start },
    focus: { path, offset: diff.end },
  }
}

/**
 * Normalize a 'pending point' a.k.a a point based on the dom state before applying
 * the pending diffs. Since the pending diffs might have been inserted with different
 * marks we have to 'walk' the offset from the starting position to ensure we still
 * have a valid point inside the document
 */
export function normalizePoint(editor: Editor, point: Point): Point | null {
  let { path, offset } = point
  if (!Editor.hasPath(editor, path)) {
    return null
  }

  let leaf = Node.get(editor, path)
  if (!Text.isText(leaf)) {
    return null
  }

  const parentBlock = Editor.above(editor, {
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
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

/**
 * Normalize a 'pending selection' to ensure it's valid in the current document state.
 */
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
    return Point.transform(point, op, { affinity: 'backward' })
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
    offset: transformed.offset + diff.text.length - diff.end + diff.start,
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
  const { path, diff, id } = textDiff

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
          id,
          path,
        }
      }

      return {
        diff: {
          start: diff.start,
          end: diff.end + op.text.length,
          text: diff.text,
        },
        id,
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
          id,
          path,
        }
      }

      return {
        diff: {
          start: diff.start,
          end: diff.end - op.text.length,
          text: diff.text,
        },
        id,
        path,
      }
    }
    case 'split_node': {
      if (!Path.equals(op.path, path) || op.position >= diff.end) {
        return {
          diff,
          id,
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
          id,
          path,
        }
      }

      return {
        diff: {
          start: diff.start - op.position,
          end: diff.end - op.position,
          text: diff.text,
        },
        id,
        path: Path.transform(path, op, { affinity: 'forward' })!,
      }
    }
    case 'merge_node': {
      if (!Path.equals(op.path, path)) {
        return {
          diff,
          id,
          path: Path.transform(path, op)!,
        }
      }

      return {
        diff: {
          start: diff.start + op.position,
          end: diff.end + op.position,
          text: diff.text,
        },
        id,
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
    id,
  }
}
