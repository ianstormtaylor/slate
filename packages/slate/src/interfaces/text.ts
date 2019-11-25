import isPlainObject from 'is-plain-object'
import { Mark, Path } from '..'

/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting marks. They are always leaf nodes in
 * the document tree as they cannot contain any children.
 */

export interface Text {
  text: string
  marks: Mark[]
  [key: string]: any
}

export const Text = {
  /**
   * Check if a value implements the `Text` interface.
   */

  isText(value: any): value is Text {
    return (
      isPlainObject(value) &&
      typeof value.text === 'string' &&
      Array.isArray(value.marks)
    )
  },

  /**
   * Check if a value is a list of `Text` objects.
   */

  isTextList(value: any): value is Text[] {
    return Array.isArray(value) && (value.length === 0 || Text.isText(value[0]))
  },

  /**
   * Check if an text matches set of properties.
   *
   * Note: this is for matching custom properties, and it does not ensure that
   * the `text` property are two nodes equal. However, if `marks` are passed it
   * will ensure that the set of marks is exactly equal.
   */

  matches(text: Text, props: Partial<Text>): boolean {
    for (const key in props) {
      if (key === 'text') {
        continue
      }

      if (key === 'marks' && props.marks != null) {
        const existing = text.marks
        const { marks } = props

        // PERF: If the lengths aren't the same, we know it's not a match.
        if (existing.length !== marks.length) {
          return false
        }

        for (const m of existing) {
          if (!Mark.exists(m, marks)) {
            return false
          }
        }

        for (const m of marks) {
          if (!Mark.exists(m, existing)) {
            return false
          }
        }

        continue
      }

      if (text[key] !== props[key]) {
        return false
      }
    }

    return true
  },
}

/**
 * `TextEntry` objects refer to an `Text` and the `Path` where it can be
 * found inside a root node.
 */

export type TextEntry = [Text, Path]
