import isPlainObject from 'is-plain-object'
import { Map, Record } from 'immutable'

import Point from './point'
import Range from './range'
import Data from './data'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  key: undefined,
  type: undefined,
  data: undefined,
  anchor: undefined,
  focus: undefined,
}

/**
 * Annotation.
 *
 * @type {Annotation}
 */

class Annotation extends Record(DEFAULTS) {
  /**
   * Create a new `Annotation` with `attrs`.
   *
   * @param {Object|Annotation} attrs
   * @return {Annotation}
   */

  static create(attrs = {}) {
    if (Annotation.isAnnotation(attrs)) {
      return attrs
    }

    if (Range.isRange(attrs)) {
      return Annotation.fromJSON(Range.createProperties(attrs))
    }

    if (isPlainObject(attrs)) {
      return Annotation.fromJSON(attrs)
    }

    throw new Error(
      `\`Annotation.create\` only accepts objects or annotations, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a map of annotations from `elements`.
   *
   * @param {Object<String,Annotation>|Map<String,Annotation>} elements
   * @return {Map<String,Annotation>}
   */

  static createMap(elements = []) {
    if (Map.isMap(elements)) {
      return elements
    }

    if (isPlainObject(elements)) {
      const obj = {}

      for (const key in elements) {
        const value = elements[key]
        const annotation = Annotation.create(value)
        obj[key] = annotation
      }

      return Map(obj)
    }

    throw new Error(
      `\`Annotation.createMap\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a dictionary of settable annotation properties from `attrs`.
   *
   * @param {Object|String|Annotation} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Annotation.isAnnotation(a)) {
      return {
        key: a.key,
        type: a.type,
        data: a.data,
        anchor: Point.createProperties(a.anchor),
        focus: Point.createProperties(a.focus),
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('key' in a) p.key = a.key
      if ('type' in a) p.type = a.type
      if ('data' in a) p.data = Data.create(a.data)
      if ('anchor' in a) p.anchor = Point.create(a.anchor)
      if ('focus' in a) p.focus = Point.create(a.focus)
      return p
    }

    throw new Error(
      `\`Annotation.createProperties\` only accepts objects or annotations, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Annotation` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Annotation}
   */

  static fromJSON(object) {
    const { key, type, data, anchor, focus } = object

    if (!key) {
      throw new Error(
        `Annotations must be created with a \`key\`, but you passed: ${JSON.stringify(
          object
        )}`
      )
    }

    if (!type) {
      throw new Error(
        `Annotations must be created with a \`type\`, but you passed: ${JSON.stringify(
          object
        )}`
      )
    }

    const annotation = new Annotation({
      key,
      type,
      data: Data.create(data || {}),
      anchor: Point.fromJSON(anchor || {}),
      focus: Point.fromJSON(focus || {}),
    })

    return annotation
  }

  /**
   * Set new `properties` on the annotation.
   *
   * @param {Object|Range|Selection} properties
   * @return {Range}
   */

  setProperties(properties) {
    properties = Annotation.createProperties(properties)
    const annotation = this.merge(properties)
    return annotation
  }

  /**
   * Return a JSON representation of the annotation.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      key: this.key,
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
 * @type {Annotation}
 */

export default Annotation
