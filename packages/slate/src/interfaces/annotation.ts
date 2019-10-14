import isPlainObject from 'is-plain-object'
import { Mark, Point, PointKey, Range } from '..'

/**
 * `Annotation` objects are a type of formatting that are applied at the
 * top-level of a Slate value. They implement both the `Mark` and `Range`
 * interfaces, such that a single annotation can describe formatting that spans
 * across multiple nodes in the document.
 */

interface Annotation extends Mark, Range {}

/**
 * `AnnotationPointEntry` objects are returned when iterating over `Point`
 * objects that belong to an `Annotation`.
 */

type AnnotationPointEntry = [Point, PointKey, Annotation, string]

namespace Annotation {
  /**
   * Check if a value implements the `Annotation` interface.
   */

  export const isAnnotation = (value: any): value is Annotation => {
    return Range.isRange(value) && Mark.isMark(value)
  }

  /**
   * Check if a value is a map of `Annotation` objects.
   */

  export const isAnnotationMap = (
    value: any
  ): value is Record<string, Annotation> => {
    if (!isPlainObject(value)) {
      return false
    }

    for (const key in value) {
      return Annotation.isAnnotation(value[key])
    }

    return true
  }
}

export { Annotation, AnnotationPointEntry }
