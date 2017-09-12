
/**
 * Prevent circular dependencies.
 */

import './document'

/**
 * Dependencies.
 */

import isPlainObject from 'is-plain-object'
import { List, Map, Record } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import Node from './node'
import generateKey from '../utils/generate-key'

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
   * Create a new `Block` from `value`.
   *
   * @param {Object|String|Block} value
   * @return {Block}
   */

  static create(value = {}) {
    if (Block.isBlock(value)) {
      return value
    }

    if (typeof value == 'string') {
      value = { type: value }
    }

    if (isPlainObject(value)) {
      return Block.fromJSON(value)
    }

    throw new Error(`\`Block.create\` only accepts objects, strings or blocks, but you passed it: ${value}`)
  }

  /**
   * Create a list of `Blocks` from `value`.
   *
   * @param {Array<Block|Object>|List<Block|Object>} value
   * @return {List<Block>}
   */

  static createList(value = []) {
    if (List.isList(value) || Array.isArray(value)) {
      const list = new List(value.map(Block.create))
      return list
    }

    throw new Error(`\`Block.createList\` only accepts arrays or lists, but you passed it: ${value}`)
  }

  /**
   * Create a `Block` from a JSON `object`.
   *
   * @param {Object|Block} object
   * @return {Block}
   */

  static fromJSON(object) {
    if (Block.isBlock(object)) {
      return object
    }

    const {
      data = {},
      isVoid = false,
      key = generateKey(),
      type,
    } = object

    let {
      nodes = [],
    } = object

    if (typeof type != 'string') {
      throw new Error('`Block.fromJSON` requires a `type` string.')
    }

    if (nodes.length == 0) {
      nodes = [{ kind: 'text', text: '' }]
    }

    const block = new Block({
      key,
      type,
      isVoid: !!isVoid,
      data: new Map(data),
      nodes: new List(nodes.map(Node.fromJSON)),
    })

    return block
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Block.fromJSON

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
    return List.isList(value) && value.every(item => Block.isBlock(item))
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

  /**
   * Return a JSON representation of the block.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      data: this.data.toJSON(),
      key: this.key,
      kind: this.kind,
      isVoid: this.isVoid,
      type: this.type,
      nodes: this.nodes.toArray().map(n => n.toJSON(options)),
    }

    if (!options.preserveKeys) {
      delete object.key
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
