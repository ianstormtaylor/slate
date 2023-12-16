import { isPlainObject } from 'is-plain-object'
import { Range } from '..'
import { ExtendedType } from '../types/custom-types'
import { isDeepEqual } from '../utils/deep-equal'

/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */

export interface BaseText {
  text: string
}

export type Text = ExtendedType<'Text', BaseText>

export interface TextEqualsOptions {
  loose?: boolean
}

export interface TextInterface {
  /**
   * Check if two text nodes are equal.
   *
   * When loose is set, the text is not compared. This is
   * used to check whether sibling text nodes can be merged.
   */
  equals: (text: Text, another: Text, options?: TextEqualsOptions) => boolean

  /**
   * Check if a value implements the `Text` interface.
   */
  isText: (value: any) => value is Text

  /**
   * Check if a value is a list of `Text` objects.
   */
  isTextList: (value: any) => value is Text[]

  /**
   * Check if some props are a partial of Text.
   */
  isTextProps: (props: any) => props is Partial<Text>

  /**
   * Check if an text matches set of properties.
   *
   * Note: this is for matching custom properties, and it does not ensure that
   * the `text` property are two nodes equal.
   */
  matches: (text: Text, props: Partial<Text>) => boolean

  /**
   * Get the leaves for a text node given decorations.
   */
  decorations: (node: Text, decorations: Range[]) => Text[]
}

// eslint-disable-next-line no-redeclare
export const Text: TextInterface = {
  equals(text: Text, another: Text, options: TextEqualsOptions = {}): boolean {
    const { loose = false } = options

    function omitText(obj: Record<any, any>) {
      const { text, ...rest } = obj

      return rest
    }

    return isDeepEqual(
      loose ? omitText(text) : text,
      loose ? omitText(another) : another
    )
  },

  isText(value: any): value is Text {
    return isPlainObject(value) && typeof value.text === 'string'
  },

  isTextList(value: any): value is Text[] {
    return Array.isArray(value) && value.every(val => Text.isText(val))
  },

  isTextProps(props: any): props is Partial<Text> {
    return (props as Partial<Text>).text !== undefined
  },

  matches(text: Text, props: Partial<Text>): boolean {
    for (const key in props) {
      if (key === 'text') {
        continue
      }

      if (
        !text.hasOwnProperty(key) ||
        text[<keyof Text>key] !== props[<keyof Text>key]
      ) {
        return false
      }
    }

    return true
  },

  decorations(node: Text, decorations: Range[]): Text[] {
    let leaves: Text[] = [{ ...node }]

    for (const dec of decorations) {
      const { anchor, focus, ...rest } = dec
      const [start, end] = Range.edges(dec)
      const next = []
      let leafEnd = 0
      const decorationStart = start.offset
      const decorationEnd = end.offset

      for (const leaf of leaves) {
        const { length } = leaf.text
        const leafStart = leafEnd
        leafEnd += length

        // If the range encompasses the entire leaf, add the range.
        if (decorationStart <= leafStart && leafEnd <= decorationEnd) {
          Object.assign(leaf, rest)
          next.push(leaf)
          continue
        }

        // If the range expanded and match the leaf, or starts after, or ends before it, continue.
        if (
          (decorationStart !== decorationEnd &&
            (decorationStart === leafEnd || decorationEnd === leafStart)) ||
          decorationStart > leafEnd ||
          decorationEnd < leafStart ||
          (decorationEnd === leafStart && leafStart !== 0)
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

        if (decorationEnd < leafEnd) {
          const off = decorationEnd - leafStart
          after = { ...middle, text: middle.text.slice(off) }
          middle = { ...middle, text: middle.text.slice(0, off) }
        }

        if (decorationStart > leafStart) {
          const off = decorationStart - leafStart
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
