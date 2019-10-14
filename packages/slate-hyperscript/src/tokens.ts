import { Mark, Node, Path, Text } from 'slate'

/**
 * A weak map to hold anchor tokens.
 */

const ANCHOR: WeakMap<Node, [number, AnchorToken]> = new WeakMap()

/**
 * A weak map to hold focus tokens.
 */

const FOCUS: WeakMap<Node, [number, FocusToken]> = new WeakMap()

/**
 * A weak map to hold annotation tokens.
 */

const ANNOTATION: WeakMap<Node, Record<number, AnnotationToken>> = new WeakMap()

/**
 * All tokens inherit from a single constructor for `instanceof` checking.
 */

export class Token {}

/**
 * Anchor tokens represent the selection's anchor point.
 */

export class AnchorToken extends Token {
  focused: boolean
  marks: Mark[] | null
  offset?: number
  path?: Path

  constructor(
    props: {
      focused?: boolean
      marks?: Mark[] | null
      offset?: number
      path?: Path
    } = {}
  ) {
    super()
    const { focused = true, marks = null, offset, path } = props
    this.focused = focused
    this.marks = marks
    this.offset = offset
    this.path = path
  }
}

/**
 * Focus tokens represent the selection's focus point.
 */

export class FocusToken extends Token {
  focused: boolean
  marks: Mark[] | null
  offset?: number
  path?: Path

  constructor(
    props: {
      focused?: boolean
      marks?: Mark[] | null
      offset?: number
      path?: Path
    } = {}
  ) {
    super()
    const { focused = true, marks = null, offset, path } = props
    this.focused = focused
    this.marks = marks
    this.offset = offset
    this.path = path
  }
}

/**
 * Annotation tokens represent an edge of an annotation range.
 */

export class AnnotationToken extends Token {
  key: string
  props: {}

  constructor(props: { key: string }) {
    super()
    const { key, ...rest } = props
    this.key = key
    this.props = rest
  }
}

/**
 * Add an anchor token to the end of a text node.
 */

export const addAnchorToken = (text: Text, token: AnchorToken) => {
  const offset = text.text.length
  ANCHOR.set(text, [offset, token])
}

/**
 * Get the offset if a text node has an associated anchor token.
 */

export const getAnchorOffset = (
  text: Text
): [number, AnchorToken] | undefined => {
  return ANCHOR.get(text)
}

/**
 * Add a focus token to the end of a text node.
 */

export const addFocusToken = (text: Text, token: FocusToken) => {
  const offset = text.text.length
  FOCUS.set(text, [offset, token])
}

/**
 * Get the offset if a text node has an associated focus token.
 */

export const getFocusOffset = (
  text: Text
): [number, FocusToken] | undefined => {
  return FOCUS.get(text)
}

/**
 * Add an annotation token to the end of a text node.
 */

export const addAnnotationToken = (text: Text, token: AnnotationToken) => {
  let map = ANNOTATION.get(text)

  if (map == null) {
    map = {}
    ANNOTATION.set(text, map)
  }

  const offset = text.text.length
  map[offset] = token
}

/**
 * Get the offset if a text node has an associated focus token.
 */

export const getAnnotationOffsets = (
  text: Text
): Record<number, AnnotationToken> | undefined => {
  return ANNOTATION.get(text)
}
