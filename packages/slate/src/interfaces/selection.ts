import isPlainObject from 'is-plain-object'
import { Mark, Point, Range } from '..'

/**
 * `Selection` objects represent the range in a document that a user has
 * selected with their cursor. They implement the `Range` interface, with an
 * extra property denoting whether the editor is currently focused or not.
 */

interface Selection extends Range {
  isFocused: boolean
  marks: Mark[] | null
}

/**
 * `SelectionPointEntry` objects are returned when iterating over `Point`
 * objects that belong to an `Selection`.
 */

type SelectionPointEntry = [Point, Selection]

namespace Selection {
  /**
   * Check if a value implements the `Selection` interface.
   */

  export const isSelection = (value: any): value is Selection => {
    return (
      isPlainObject(value) &&
      typeof value.isFocused === 'boolean' &&
      (value.marks == null || Mark.isMarkList(value.marks)) &&
      Range.isRange(value)
    )
  }
}

export { Selection, SelectionPointEntry }
