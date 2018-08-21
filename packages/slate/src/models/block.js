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
 * Block.
 *
 * @type {Block}
 */

class Block extends Record(DEFAULTS) {
  /**
   * Create a new `Block` from `attrs`.
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
      return Block.fromJSON(attrs)
    }

    throw new Error(
      `\`Block.create\` only accepts objects, strings or blocks, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a list of `Blocks` from `attrs`.
   *
   * @param {Array<Block|Object>|List<Block|Object>} attrs
   * @return {List<Block>}
   */

  static createList(attrs = []) {
    if (List.isList(attrs) || Array.isArray(attrs)) {
      const list = new List(attrs.map(Block.create))
      return list
    }

    throw new Error(
      `\`Block.createList\` only accepts arrays or lists, but you passed it: ${attrs}`
    )
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

    const { data = {}, key = KeyUtils.create(), nodes = [], type } = object

    if (typeof type != 'string') {
      throw new Error('`Block.fromJSON` requires a `type` string.')
    }

    const block = new Block({
      key,
      type,
      data: Map(data),
      nodes: Block.createChildren(nodes),
    })

    return block
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Block.fromJSON

  /**
   * Check if `any` is a `Block`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isBlock = isType.bind(null, 'BLOCK')

  /**
   * Check if `any` is a block list.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  static isBlockList(any) {
    return List.isList(any) && any.every(item => Block.isBlock(item))
  }

  /**
   * Object.
   *
   * @return {String}
   */

  get object() {
    return 'block'
  }

  get kind() {
    logger.deprecate(
      'slate@0.32.0',
      'The `kind` property of Slate objects has been renamed to `object`.'
    )
    return this.object
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

Block.prototype[MODEL_TYPES.BLOCK] = true

/**
 * Export.
 *
 * @type {Block}
 */

export default Block
