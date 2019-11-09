import isPlainObject from 'is-plain-object'
import { Range, Mark } from 'slate'

/**
 * The `Leaf` interface represents the individual leaves inside a text node,
 * once annotations and decorations have been applied.
 */

interface Leaf {
  annotations: Range[]
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
      leaf.annotations.length === another.annotations.length &&
      leaf.decorations.length === another.decorations.length &&
      leaf.marks.length === another.marks.length &&
      leaf.marks.every(m => Mark.exists(m, another.marks)) &&
      another.marks.every(m => Mark.exists(m, leaf.marks)) &&
      leaf.decorations.every(d => Range.exists(d, another.decorations)) &&
      another.decorations.every(d => Range.exists(d, leaf.decorations)) &&
      leaf.annotations.every(a => Range.exists(a, another.annotations)) &&
      another.annotations.every(a => Range.exists(a, leaf.annotations))
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
      Range.isRangeList(value.decorations) &&
      Range.isRangeMap(value.annotations)
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
        annotations: [...leaf.annotations],
        decorations: [...leaf.decorations],
      },
      {
        text: leaf.text.slice(offset),
        marks: leaf.marks,
        annotations: [...leaf.annotations],
        decorations: [...leaf.decorations],
      },
    ]
  }
}

export { Leaf }
