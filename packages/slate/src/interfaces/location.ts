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

type Span = [Path, Path]

namespace Span {
  /**
   * Check if a value implements the `Span` interface.
   */

  export const isSpan = (value: any): value is Span => {
    return (
      Array.isArray(value) && value.length === 2 && value.every(Path.isPath)
    )
  }
}

export { Location, Span }
