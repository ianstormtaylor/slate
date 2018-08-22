import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Record } from 'immutable'

import Decoration from './decoration'
import MODEL_TYPES from '../constants/model-types'
import Point from './point'
import Selection from './selection'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  anchor: Point.create(),
  focus: Point.create(),
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
      if ('isFocused' in attrs || 'marks' in attrs) {
        logger.deprecate(
          '0.39.0',
          'Using `Range.create` for selections is deprecated, please use `Selection.create` instead.'
        )

        return Selection.create(attrs)
      }

      if ('isAtomic' in attrs) {
        logger.deprecate(
          '0.39.0',
          'Using `Range.create` for decorations is deprecated, please use `Decoration.create` instead.'
        )

        return Decoration.create(attrs)
      }

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
    let { anchor, focus } = object

    if (
      !anchor &&
      (object.anchorKey || object.anchorOffset || object.anchorPath)
    ) {
      logger.deprecate(
        '0.37.0',
        '`Range` objects now take a `Point` object as an `anchor` instead of taking `anchorKey/Offset/Path` properties. But you passed:',
        object
      )

      anchor = {
        key: object.anchorKey,
        offset: object.anchorOffset,
        path: object.anchorPath,
      }
    }

    if (!focus && (object.focusKey || object.focusOffset || object.focusPath)) {
      logger.deprecate(
        '0.37.0',
        '`Range` objects now take a `Point` object as a `focus` instead of taking `focusKey/Offset/Path` properties. But you passed:',
        object
      )

      focus = {
        key: object.focusKey,
        offset: object.focusOffset,
        path: object.focusPath,
      }
    }

    const range = new Range({
      anchor: Point.fromJSON(anchor || {}),
      focus: Point.fromJSON(focus || {}),
    })

    return range
  }

  /**
   * Check if an `obj` is a `Range`, or is range-like.
   *
   * @param {Any} obj
   * @return {Boolean}
   */

  static isRange(obj) {
    return (
      !!(obj && obj[MODEL_TYPES.RANGE]) ||
      Decoration.isDecoration(obj) ||
      Selection.isSelection(obj)
    )
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'range'
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
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
