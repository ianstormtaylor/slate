import isPlainObject from 'is-plain-object'
import warning from 'tiny-warning'
import { List, Record } from 'immutable'

import Mark from './mark'
import Point from './point'
import Data from './data'
import Range from './range'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  type: undefined,
  data: undefined,
  anchor: undefined,
  focus: undefined,
}

/**
 * Decoration.
 *
 * @type {Decoration}
 */

class Decoration extends Record(DEFAULTS) {
  /**
   * Create a new `Decoration` with `attrs`.
   *
   * @param {Object|Decoration} attrs
   * @return {Decoration}
   */

  static create(attrs = {}) {
    if (Decoration.isDecoration(attrs)) {
      return attrs
    }

    if (Range.isRange(attrs)) {
      return Decoration.fromJSON(Range.createProperties(attrs))
    }

    if (isPlainObject(attrs)) {
      return Decoration.fromJSON(attrs)
    }

    throw new Error(
      `\`Decoration.create\` only accepts objects or decorations, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Ranges` from `elements`.
   *
   * @param {Array<Decoration|Object>|List<Decoration|Object>} elements
   * @return {List<Decoration>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Decoration.create))
      return list
    }

    throw new Error(
      `\`Decoration.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a dictionary of settable decoration properties from `attrs`.
   *
   * @param {Object|String|Decoration} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Decoration.isDecoration(a)) {
      return {
        type: a.type,
        data: a.data,
        anchor: Point.createProperties(a.anchor),
        focus: Point.createProperties(a.focus),
        mark: Mark.create(a.mark),
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('type' in a) p.type = a.type
      if ('data' in a) p.data = Data.create(a.data)
      if ('anchor' in a) p.anchor = Point.create(a.anchor)
      if ('focus' in a) p.focus = Point.create(a.focus)
      return p
    }

    throw new Error(
      `\`Decoration.createProperties\` only accepts objects or decorations, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Decoration` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Decoration}
   */

  static fromJSON(object) {
    const { anchor, focus } = object
    let { type, data } = object

    if (object.mark && !type) {
      warning(
        false,
        'As of slate@0.47 the `decoration.mark` property has been changed to `decoration.type` and `decoration.data` directly.'
      )

      type = object.mark.type
      data = object.mark.data
    }

    if (!type) {
      throw new Error(
        `Decorations must be created with a \`type\`, but you passed: ${JSON.stringify(
          object
        )}`
      )
    }

    const decoration = new Decoration({
      type,
      data: Data.create(data || {}),
      anchor: Point.fromJSON(anchor || {}),
      focus: Point.fromJSON(focus || {}),
    })

    return decoration
  }

  /**
   * Set new `properties` on the decoration.
   *
   * @param {Object|Range|Selection} properties
   * @return {Range}
   */

  setProperties(properties) {
    properties = Decoration.createProperties(properties)
    const decoration = this.merge(properties)
    return decoration
  }

  /**
   * Return a JSON representation of the decoration.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      type: this.type,
      data: this.data.toJSON(),
      anchor: this.anchor.toJSON(options),
      focus: this.focus.toJSON(options),
    }

    return object
  }
}

/**
 * Export.
 *
 * @type {Decoration}
 */

export default Decoration
