import { Node, Path, Point, Text } from 'slate'
import { HyperscriptPointRef, HyperscriptRangeRef } from './refs'

/**
 * A weak map to hold anchor tokens.
 */

const ANCHORS: WeakMap<Node, Set<[number, AnchorToken]>> = new WeakMap()

/**
 * A weak map to hold focus tokens.
 */

const FOCI: WeakMap<Node, Set<[number, FocusToken]>> = new WeakMap()

/**
 * A weak map to hold point tokens.
 */

const POINTS: WeakMap<Node, Set<[number, PointToken]>> = new WeakMap()

/**
 * All tokens inherit from a single constructor for `instanceof` checking.
 */

export class Token<Ref = unknown> {
  offset?: number
  path?: Path
  ref?: Ref

  constructor(
    props: {
      offset?: number
      path?: Path
      ref?: Ref
    } = {}
  ) {
    const { offset, path, ref } = props
    this.offset = offset
    this.path = path

    if (ref) {
      if (path != null) {
        throw new Error(
          'The ref prop of a token cannot be used with the path prop.'
        )
      }
      this.ref = ref
    }
  }
}

/**
 * Anchor tokens represent the selection's anchor point.
 */

export class AnchorToken extends Token<HyperscriptRangeRef> {}

/**
 * Focus tokens represent the selection's focus point.
 */

export class FocusToken extends Token<HyperscriptRangeRef> {}

/**
 * Point tokens represent arbitrary points.
 */

export class PointToken extends Token<HyperscriptPointRef> {}

/**
 * Add an anchor token to the end of a text node.
 */

export function addAnchorToken(text: Text, token: AnchorToken) {
  const offset = text.text.length

  let anchors = ANCHORS.get(text)
  if (!anchors) {
    anchors = new Set()
    ANCHORS.set(text, anchors)
  }

  anchors.add([offset, token])
}

/**
 * Get the associated anchor tokens for a text node.
 */

export function getAnchors(text: Text): AnchorToken[] {
  const anchors = ANCHORS.get(text)
  if (!anchors) return []

  return Array.from(
    anchors.values(),
    ([offset, token]) => new AnchorToken({ ...token, offset })
  )
}

/**
 * Add a focus token to the end of a text node.
 */

export function addFocusToken(text: Text, token: FocusToken) {
  const offset = text.text.length

  let foci = FOCI.get(text)
  if (!foci) {
    foci = new Set()
    FOCI.set(text, foci)
  }

  foci.add([offset, token])
}

/**
 * Get the associated focus tokens for a text node.
 */

export function getFoci(text: Text): FocusToken[] {
  const foci = FOCI.get(text)
  if (!foci) return []

  return Array.from(
    foci.values(),
    ([offset, token]) => new FocusToken({ ...token, offset })
  )
}

/**
 * Add a point token to the end of a text node.
 */

export function addPointToken(text: Text, token: PointToken) {
  const offset = text.text.length

  let points = POINTS.get(text)
  if (!points) {
    points = new Set()
    POINTS.set(text, points)
  }

  points.add([offset, token])
}

/**
 * Get the associated point tokens for a text node.
 */

export function getPoints(text: Text): PointToken[] {
  const points = POINTS.get(text)
  if (!points) return []

  return Array.from(
    points.values(),
    ([offset, token]) => new PointToken({ ...token, offset })
  )
}
