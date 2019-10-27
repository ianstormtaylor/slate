import isPlainObject from 'is-plain-object'
import { Path, Point, Range } from '..'

/**
 * The `Location` interface is a union of the ways to refer to a specific
 * location in a Slate document: paths, points or ranges.
 *
 * Methods will often accept a `Location` instead of requiring only a `Path`,
 * `Point` or `Range`. This eliminates the need for developers to manage
 * converting between the different interfaces in their own code base.
 */

type Location = Path | Point | Range

namespace Location {
  /**
   * Check if a value implements the `Location` interface.
   */

  export const isLocation = (value: any): value is Location => {
    return Path.isPath(value) || Point.isPoint(value) || Range.isRange(value)
  }
}

export { Location }
