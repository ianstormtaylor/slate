import { Path, Text, isObject } from '..'

/**
 * `Mark` objects represent formatting that is applied to text in a Slate
 * document. They appear in leaf text nodes in the document.
 */

export interface Mark {
  [key: string]: any
}

// eslint-disable-next-line no-redeclare
export const Mark = {
  /**
   * Check if a mark exists in a set of marks.
   */

  exists(mark: Mark, marks: Mark[]): boolean {
    return !!marks.find(candidate => Mark.matches(candidate, mark))
  },

  /**
   * Check if a value implements the `Mark` interface.
   */

  isMark(value: any): value is Mark {
    return isObject(value)
  },

  /**
   * Check if a value is an array of `Mark` objects.
   */

  isMarkSet(value: any): value is Mark[] {
    return (
      Array.isArray(value) && value.every(candidate => Mark.isMark(candidate))
    )
  },

  /**
   * Check if a mark matches set of properties.
   */

  matches(mark: Mark, props: Partial<Mark>): boolean {
    for (const key in props) {
      if (mark[key] !== props[key]) {
        return false
      }
    }

    return true
  },
}

/**
 * `MarkEntry` tuples are returned when iterating through the marks in a text
 * node. They include the index of the mark in the text node's marks array, as
 * well as the text node and its path in the root node.
 */

export type MarkEntry = [Mark, number, Text, Path]

/**
 * `MarkMatch` values are used as shorthands for matching mark objects.
 */

export type MarkMatch = Partial<Mark> | ((entry: MarkEntry) => boolean)
