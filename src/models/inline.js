
/**
 * Prevent circular dependencies.
 */

import './document'

/**
 * Dependencies.
 */

import Block from './block'
import Data from './data'
import Node from './node'
import Text from './text'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import { List, Map, Record } from 'immutable'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  data: new Map(),
  isVoid: false,
  key: null,
  nodes: new List(),
  type: null
}

/**
 * Inline.
 *
 * @type {Inline}
 */

class Inline extends new Record(DEFAULTS) {

  /**
   * Create a new `Inline` with `attrs`.
   *
   * @param {Object|Inline} attrs
   * @return {Inline}
   */

  static create(attrs = {}) {
    if (Block.isBlock(attrs)) return attrs
    if (Inline.isInline(attrs)) return attrs
    if (Text.isText(attrs)) return attrs

    if (!attrs.type) {
      throw new Error('You must pass an inline `type`.')
    }

    const { nodes } = attrs
    const empty = !nodes || nodes.size == 0 || nodes.length == 0
    const inline = new Inline({
      type: attrs.type,
      key: attrs.key || generateKey(),
      data: Data.create(attrs.data),
      isVoid: !!attrs.isVoid,
      nodes: Node.createList(empty ? [Text.create()] : nodes),
    })

    return inline
  }

  /**
   * Create a list of `Inlines` from an array.
   *
   * @param {Array<Object|Inline>} elements
   * @return {List<Inline>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) return elements
    return new List(elements.map(Inline.create))
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
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'inline'
  }

  /**
   * Is the node empty?
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the concatenated text `string` of all child nodes.
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
