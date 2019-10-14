import isPlainObject from 'is-plain-object'
import { Mark, Path } from '..'

/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting marks. They are always leaf nodes in
 * the document tree as they cannot contain any children.
 */

interface Text {
  text: string
  marks: Mark[]
}

/**
 * `TextEntry` objects refer to an `Text` and the `Path` where it can be
 * found inside a root node.
 */

type TextEntry = [Text, Path]

namespace Text {
  /**
   * Check if a value implements the `Text` interface.
   */

  export const isText = (value: any): value is Text => {
    return (
      isPlainObject(value) &&
      typeof value.text === 'string' &&
      Array.isArray(value.marks)
    )
  }

  /**
   * Check if a value is a list of `Text` objects.
   */

  export const isTextList = (value: any): value is Text[] => {
    return Array.isArray(value) && (value.length === 0 || Text.isText(value[0]))
  }
}

export { Text, TextEntry }
