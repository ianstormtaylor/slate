/**
 * Dependencies.
 */

import isPlainObject from 'is-plain-object'
import logger from 'slate-dev-logger'
import { List, Map, Record } from 'immutable'

import MODEL_TYPES, { isType } from '../constants/model-types'
import KeyUtils from '../utils/key-utils'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  key: undefined,
  nodes: new List(),
  type: undefined,
}

/**
 * Inline.
 *
 * @type {Inline}
 */

class Inline extends Record(DEFAULTS) {
  /**
   * Create a new `Inline` with `attrs`.
   *
   * @param {Object|String|Inline} attrs
   * @return {Inline}
   */

  static create(attrs = {}) {
    if (Inline.isInline(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { type: attrs }
    }

    if (isPlainObject(attrs)) {
      return Inline.fromJSON(attrs)
    }

    throw new Error(
      `\`Inline.create\` only accepts objects, strings or inlines, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Inlines` from an array.
   *
   * @param {Array<Inline|Object>|List<Inline|Object>} elements
   * @return {List<Inline>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Inline.create))
      return list
    }

    throw new Error(
      `\`Inline.createList\` only accepts arrays or lists, but you passed it: ${elements}`
    )
  }

  /**
   * Create a `Inline` from a JSON `object`.
   *
   * @param {Object|Inline} object
   * @return {Inline}
   */

  static fromJSON(object) {
    if (Inline.isInline(object)) {
      return object
    }

    const { data = {}, key = KeyUtils.create(), nodes = [], type } = object

    if (typeof type != 'string') {
      throw new Error('`Inline.fromJS` requires a `type` string.')
    }

    const inline = new Inline({
      key,
      type,
      data: new Map(data),
      nodes: Inline.createChildren(nodes),
    })

    return inline
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Inline.fromJSON

  /**
   * Check if `any` is a `Inline`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isInline = isType.bind(null, 'INLINE')

  /**
   * Check if `any` is a list of inlines.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isInlineList(any) {
    return List.isList(any) && any.every(item => Inline.isInline(item))
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'inline'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
  }

  /**
   * Get the concatenated text of all the inline's children.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
  }

  /**
   * Return a JSON representation of the inline.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      type: this.type,
      data: this.data.toJSON(),
      nodes: this.nodes.toArray().map(n => n.toJSON(options)),
    }

    if (options.preserveKeys) {
      object.key = this.key
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS(options) {
    return this.toJSON(options)
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Inline.prototype[MODEL_TYPES.INLINE] = true

/**
 * Export.
 *
 * @type {Inline}
 */

export default Inline
