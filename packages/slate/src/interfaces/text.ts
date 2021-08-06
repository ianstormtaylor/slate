import isPlainObject from 'is-plain-object'
import isEqual from 'fast-deep-equal'
import { Range } from '..'
import { ExtendedType } from './custom-types'

/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */

export interface BaseText {
  text: string
}

export type Text = ExtendedType<'Text', BaseText>

export interface TextInterface {
  equals: (text: Text, another: Text, options?: { loose?: boolean }) => boolean
  isText: (value: any) => value is Text
  isTextList: (value: any) => value is Text[]
  isTextProps: (props: any) => props is Partial<Text>
  matches: (text: Text, props: Partial<Text>) => boolean
  decorations: (node: Text, decorations: Range[]) => Text[]
}

export const Text: TextInterface = {
  /**
   * Check if two text nodes are equal.
   */

  equals(
    text: Text,
    another: Text,
    options: { loose?: boolean } = {}
  ): boolean {
    const { loose = false } = options

    function omitText(obj: Record<any, any>) {
      const { text, ...rest } = obj

      return rest
    }

    return isEqual(
      loose ? omitText(text) : text,
      loose ? omitText(another) : another
    )
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
    return Array.isArray(value) && value.every(val => Text.isText(val))
  },

  /**
   * Check if some props are a partial of Text.
   */

  isTextProps(props: any): props is Partial<Text> {
    return (props as Partial<Text>).text !== undefined
  },

  /**
   * Check if an text matches set of properties.
   *
   * Note: this is for matching custom properties, and it does not ensure that
   * the `text` property are two nodes equal.
   */

  matches(text: Text, props: Partial<Text>): boolean {
    for (const key in props) {
      if (key === 'text') {
        continue
      }

      if (!text.hasOwnProperty(key) || text[key] !== props[key]) {
        return false
      }
    }

    return true
  },

  /**
   * Get the leaves for a text node given decorations.
   */

  decorations(node: Text, decorations: Range[]): Text[] {
    let leaves: Text[] = [{ ...node }]

    for (const dec of decorations) {
      const { anchor, focus, ...rest } = dec
      const [start, end] = Range.edges(dec)
      const next = []
      let o = 0

      for (const leaf of leaves) {
        const { length } = leaf.text
        const offset = o
        o += length

        // If the range encompases the entire leaf, add the range.
        if (start.offset <= offset && end.offset >= o) {
          Object.assign(leaf, rest)
          next.push(leaf)
          continue
        }

        // If the range expanded and match the leaf, or starts after, or ends before it, continue.
        if (
          (start.offset !== end.offset &&
            (start.offset === o || end.offset === offset)) ||
          start.offset > o ||
          end.offset < offset ||
          (end.offset === offset && offset !== 0)
        ) {
          next.push(leaf)
          continue
        }

        // Otherwise we need to split the leaf, at the start, end, or both,
        // and add the range to the middle intersecting section. Do the end
        // split first since we don't need to update the offset that way.
        let middle = leaf
        let before
        let after

        if (end.offset < o) {
          const off = end.offset - offset
          after = { ...middle, text: middle.text.slice(off) }
          middle = { ...middle, text: middle.text.slice(0, off) }
        }

        if (start.offset > offset) {
          const off = start.offset - offset
          before = { ...middle, text: middle.text.slice(0, off) }
          middle = { ...middle, text: middle.text.slice(off) }
        }

        Object.assign(middle, rest)

        if (before) {
          next.push(before)
        }

        next.push(middle)

        if (after) {
          next.push(after)
        }
      }

      leaves = next
    }

    return leaves
  },
}
