
/**
 * Prevent circular dependencies.
 */

import './document'

/**
 * Dependencies.
 */

import Data from './data'
import Node from './node'
import Text from './text'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import isPlainObject from 'is-plain-object'
import { List, Map, Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  isVoid: false,
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
      const { data, isVoid, key, type } = attrs
      let { nodes } = attrs

      if (typeof type != 'string') {
        throw new Error('`Inline.create` requires a block `type` string.')
      }

      if (nodes == null || nodes.length == 0) {
        nodes = [Text.create()]
      }

      const inline = new Inline({
        data: Data.create(data),
        isVoid: !!isVoid,
        key: key || generateKey(),
        nodes: Node.createList(nodes),
        type,
      })

      return inline
    }

    throw new Error(`\`Inline.create\` only accepts objects, strings or inlines, but you passed it: ${attrs}`)
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

    throw new Error(`\`Inline.createList\` only accepts arrays or lists, but you passed it: ${elements}`)
  }

  /**
   * Check if a `value` is a `Inline`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isInline(value) {
    return !!(value && value[MODEL_TYPES.INLINE])
  }

  /**
   * Check if a `value` is a list of inlines.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isInlineList(value) {
    return List.isList(value) && value.size > 0 && Inline.isInline(value.first())
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'inline'
  }

  /**
   * Check if the inline is empty.
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the concatenated text of all the inline's children.
   *
   * @return {String}
   */

  get text() {
    return this.getText()
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Inline.prototype[MODEL_TYPES.INLINE] = true

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(Node.prototype).forEach((method) => {
  if (method == 'constructor') return
  Inline.prototype[method] = Node.prototype[method]
})

/**
 * Export.
 *
 * @type {Inline}
 */

export default Inline
