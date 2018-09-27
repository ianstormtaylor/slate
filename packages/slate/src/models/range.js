import isPlainObject from 'is-plain-object'
import { List, Record } from 'immutable'

import Decoration from './decoration'
import Point from './point'
import Selection from './selection'
import isObject from '../utils/is-object'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  anchor: undefined,
  focus: undefined,
}

/**
 * Range.
 *
 * @type {Range}
 */

class Range extends Record(DEFAULTS) {
  /**
   * Create a new `Range` with `attrs`.
   *
   * @param {Object|Range} attrs
   * @return {Range}
   */

  static create(attrs = {}) {
    if (Range.isRange(attrs)) {
      if (attrs.object === 'range') {
        return attrs
      } else {
        return Range.fromJSON(Range.createProperties(attrs))
      }
    }

    if (isPlainObject(attrs)) {
      return Range.fromJSON(attrs)
    }

    throw new Error(
      `\`Range.create\` only accepts objects or ranges, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Ranges` from `elements`.
   *
   * @param {Array<Range|Object>|List<Range|Object>} elements
   * @return {List<Range>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Range.create))
      return list
    }

    throw new Error(
      `\`Range.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a dictionary of settable range properties from `attrs`.
   *
   * @param {Object|String|Range} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Range.isRange(a)) {
      return {
        anchor: Point.createProperties(a.anchor),
        focus: Point.createProperties(a.focus),
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('anchor' in a) p.anchor = Point.create(a.anchor)
      if ('focus' in a) p.focus = Point.create(a.focus)
      return p
    }

    throw new Error(
      `\`Range.createProperties\` only accepts objects, decorations, ranges or selections, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Range` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Range}
   */

  static fromJSON(object) {
    const { anchor, focus } = object
    const range = new Range({
      anchor: Point.fromJSON(anchor || {}),
      focus: Point.fromJSON(focus || {}),
    })

    return range
  }

  /**
   * Check if a `value` is a `Range`, or is range-like.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isRange(value) {
    return (
      isObject('range', value) ||
      Decoration.isDecoration(value) ||
      Selection.isSelection(value)
    )
  }

  /**
   * Return a JSON representation of the range.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      anchor: this.anchor.toJSON(options),
      focus: this.focus.toJSON(options),
    }

    return object
  }
}

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
