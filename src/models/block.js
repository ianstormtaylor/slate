
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
 * Block.
 *
 * @type {Block}
 */

class Block extends Record(DEFAULTS) {

  /**
   * Create a new `Block` with `attrs`.
   *
   * @param {Object|String|Block} attrs
   * @return {Block}
   */

  static create(attrs = {}) {
    if (Block.isBlock(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { type: attrs }
    }

    if (isPlainObject(attrs)) {
      const { data, isVoid, key, type } = attrs
      let { nodes } = attrs

      if (typeof type != 'string') {
        throw new Error('`Block.create` requires a block `type` string.')
      }

      if (nodes == null || nodes.length == 0) {
        nodes = [Text.create()]
      }

      const block = new Block({
        data: Data.create(data),
        isVoid: !!isVoid,
        key: key || generateKey(),
        nodes: Node.createList(nodes),
        type,
      })

      return block
    }

    throw new Error(`\`Block.create\` only accepts objects, strings or blocks, but you passed it: ${attrs}`)
  }

  /**
   * Create a list of `Blocks` from `elements`.
   *
   * @param {Array<Block|Object>|List<Block|Object>} elements
   * @return {List<Block>}
   */

  static createList(elements = []) {
    if (List.isList(elements) || Array.isArray(elements)) {
      const list = new List(elements.map(Block.create))
      return list
    }

    throw new Error(`\`Block.createList\` only accepts arrays or lists, but you passed it: ${elements}`)
  }

  /**
   * Check if a `value` is a `Block`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isBlock(value) {
    return !!(value && value[MODEL_TYPES.BLOCK])
  }

  /**
   * Check if a `value` is a block list.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isBlockList(value) {
    return List.isList(value) && value.size > 0 && Block.isBlock(value.first())
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'block'
  }

  /**
   * Check if the block is empty.
   *
   * @return {Boolean}
   */

  get isEmpty() {
    return this.text == ''
  }

  /**
   * Get the concatenated text of all the block's children.
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

Block.prototype[MODEL_TYPES.BLOCK] = true

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(Node.prototype).forEach((method) => {
  if (method == 'constructor') return
  Block.prototype[method] = Node.prototype[method]
})

/**
 * Export.
 *
 * @type {Block}
 */

export default Block
