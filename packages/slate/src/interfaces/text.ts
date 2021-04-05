import isPlainObject from 'is-plain-object'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import { Range, Editor, Element, Node, Value, NodeProps } from '..'
import { Simplify, UnionToIntersection } from '../utils/types'

/**
 * A utility type to get all the text node types from a root node type.
 */

export type TextOf<N extends Node> = Editor<Value> extends N
  ? Text
  : Element extends N
  ? Text
  : N extends Editor<Value>
  ? TextOf<N['children'][number]>
  : N extends Element
  ? Extract<N['children'][number], Text> | TextOf<N['children'][number]>
  : N extends Text
  ? N
  : never

/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */

export interface Text {
  text: string
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
    return isEqual(
      loose ? omit(text, 'text') : text,
      loose ? omit(another, 'text') : another
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
   * Check if an text matches set of properties.
   *
   * Note: this is for matching custom properties, and it does not ensure that
   * the `text` property are two nodes equal.
   */

  matches<T extends Text>(text: T, props: object): boolean {
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

  decorations<T extends Text>(node: T, decorations: Range[]): T[] {
    let leaves: T[] = [{ ...node }]

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

/**
 * A utility type to get all the mark types from a root node type.
 */

// export type MarksOf<N extends Node> = NodeProps<TextOf<N>> | {}

export type MarksOf<N extends Node> = Simplify<
  UnionToIntersection<NodeProps<TextOf<N>>>
>

export type MarkKeysOf<N extends Node> = {} extends MarksOf<N>
  ? unknown
  : keyof MarksOf<N>
