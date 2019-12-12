import isPlainObject from 'is-plain-object'
import { Path } from '..'
import isMatch from 'lodash/isMatch'

/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */

export interface Text {
  text: string
  [key: string]: any
}

export const Text = {
  /**
   * Check if two text nodes are equal.
   */

  equals(
    text: Text,
    another: Text,
    options: { loose?: boolean } = {}
  ): boolean {
    const { loose = false } = options

    for (const key in text) {
      if (loose && key === 'text') {
        continue
      }

      if (text[key] !== another[key]) {
        return false
      }
    }

    for (const key in another) {
      if (loose && key === 'text') {
        continue
      }

      if (text[key] !== another[key]) {
        return false
      }
    }

    return true
  },

  /**
   * Check if a value implements the `Text` interface.
   */

  isText(value: any): value is Text {
    return isPlainObject(value) && typeof value.text === 'string'
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
   * the `text` property are two nodes equal.
   */

  matches(text: Text, props: Partial<Text>): boolean {
    return isMatch(text, props)
  },
}

/**
 * `TextEntry` objects refer to an `Text` and the `Path` where it can be
 * found inside a root node.
 */

export type TextEntry = [Text, Path]
