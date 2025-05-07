import { Ancestor, DecoratedRange, Editor, Range } from 'slate'
import { PLACEHOLDER_SYMBOL } from './weak-maps'
import { DOMEditor } from '../plugin/dom-editor'

export const shallowCompare = (
  obj1: { [key: string]: unknown },
  obj2: { [key: string]: unknown }
) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  )

const isDecorationFlagsEqual = (range: Range, other: Range) => {
  const { anchor: rangeAnchor, focus: rangeFocus, ...rangeOwnProps } = range
  const { anchor: otherAnchor, focus: otherFocus, ...otherOwnProps } = other

  return (
    range[PLACEHOLDER_SYMBOL] === other[PLACEHOLDER_SYMBOL] &&
    shallowCompare(rangeOwnProps, otherOwnProps)
  )
}

/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */

export const isElementDecorationsEqual = (
  list: Range[] | null,
  another: Range[] | null
): boolean => {
  if (list === another) {
    return true
  }

  if (!list || !another) {
    return false
  }

  if (list.length !== another.length) {
    return false
  }

  for (let i = 0; i < list.length; i++) {
    const range = list[i]
    const other = another[i]

    if (!Range.equals(range, other) || !isDecorationFlagsEqual(range, other)) {
      return false
    }
  }

  return true
}

/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */

export const isTextDecorationsEqual = (
  list: Range[] | null,
  another: Range[] | null
): boolean => {
  if (list === another) {
    return true
  }

  if (!list || !another) {
    return false
  }

  if (list.length !== another.length) {
    return false
  }

  for (let i = 0; i < list.length; i++) {
    const range = list[i]
    const other = another[i]

    // compare only offsets because paths doesn't matter for text
    if (
      range.anchor.offset !== other.anchor.offset ||
      range.focus.offset !== other.focus.offset ||
      !isDecorationFlagsEqual(range, other)
    ) {
      return false
    }
  }

  return true
}

/**
 * Split and group decorations by each child of a node.
 *
 * @returns An array with length equal to that of `node.children`. Each index
 * corresponds to a child of `node`, and the value is an array of decorations
 * for that child.
 */

export const splitDecorationsByChild = (
  editor: Editor,
  node: Ancestor,
  decorations: DecoratedRange[]
): DecoratedRange[][] => {
  const decorationsByChild = Array.from(
    node.children,
    (): DecoratedRange[] => []
  )

  if (decorations.length === 0) {
    return decorationsByChild
  }

  const path = DOMEditor.findPath(editor, node)
  const level = path.length
  const ancestorRange = Editor.range(editor, path)

  const cachedChildRanges = new Array<Range | undefined>(node.children.length)

  const getChildRange = (index: number) => {
    const cachedRange = cachedChildRanges[index]
    if (cachedRange) return cachedRange
    const childRange = Editor.range(editor, [...path, index])
    cachedChildRanges[index] = childRange
    return childRange
  }

  for (const decoration of decorations) {
    const decorationRange = Range.intersection(ancestorRange, decoration)
    if (!decorationRange) continue

    const [startPoint, endPoint] = Range.edges(decorationRange)
    const startIndex = startPoint.path[level]
    const endIndex = endPoint.path[level]

    for (let i = startIndex; i <= endIndex; i++) {
      const ds = decorationsByChild[i]
      if (!ds) continue

      const childRange = getChildRange(i)
      const childDecorationRange = Range.intersection(childRange, decoration)
      if (!childDecorationRange) continue

      ds.push({
        ...decoration,
        ...childDecorationRange,
      })
    }
  }

  return decorationsByChild
}
