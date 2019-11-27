import isPlainObject from 'is-plain-object'
import { Range, Mark } from 'slate'

/**
 * The `Leaf` interface represents the individual leaves inside a text node,
 * once decorations have been applied.
 */

interface Leaf {
  decorations: Range[]
  marks: Mark[]
  text: string
}

namespace Leaf {
  /**
   * Check if two leaves are equal.
   */

  export const equals = (leaf: Leaf, another: Leaf): boolean => {
    return (
      leaf.text === another.text &&
      leaf.decorations.length === another.decorations.length &&
      leaf.marks.length === another.marks.length &&
      leaf.marks.every(m => Mark.exists(m, another.marks)) &&
      another.marks.every(m => Mark.exists(m, leaf.marks)) &&
      isRangeListEqual(leaf.decorations, another.decorations)
    )
  }

  /**
   * Check if a value is a `Leaf` object.
   */

  export const isLeaf = (value: any): value is Leaf => {
    return (
      isPlainObject(value) &&
      typeof value.text === 'string' &&
      Mark.isMarkSet(value.marks) &&
      Range.isRangeList(value.decorations)
    )
  }

  /**
   * Split a leaf into two at an offset.
   */

  export const split = (leaf: Leaf, offset: number): [Leaf, Leaf] => {
    return [
      {
        text: leaf.text.slice(0, offset),
        marks: leaf.marks,
        decorations: [...leaf.decorations],
      },
      {
        text: leaf.text.slice(offset),
        marks: leaf.marks,
        decorations: [...leaf.decorations],
      },
    ]
  }
}

/**
 * Check if a list of ranges is equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */

const isRangeListEqual = (list: Range[], another: Range[]): boolean => {
  if (list.length !== another.length) {
    return false
  }

  for (let i = 0; i < list.length; i++) {
    const range = list[i]
    const other = another[i]

    if (!Range.equals(range, other)) {
      return false
    }
  }

  return true
}

/**
 * Check if a map of ranges is equal to another.
 */

const isRangeMapEqual = (
  map: Record<string, Range>,
  another: Record<string, Range>
): boolean => {
  if (Object.keys(map).length !== Object.keys(another).length) {
    return false
  }

  for (const key in map) {
    const range = map[key]
    const other = another[key]

    if (!Range.equals(range, other)) {
      return false
    }
  }

  return true
}

export { Leaf, isRangeListEqual, isRangeMapEqual }
