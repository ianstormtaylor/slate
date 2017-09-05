
/**
 * Prevent circular dependencies.
 */

import './document'

/**
 * Dependencies.
 */

import Data from './data'
import Node from './node'
import Inline from './inline'
import Text from './text'
import MODEL_TYPES from '../constants/model-types'
import generateKey from '../utils/generate-key'
import { Map, List, Record } from 'immutable'

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
 * Block.
 *
 * @type {Block}
 */

class Block extends new Record(DEFAULTS) {

  /**
   * Create a new `Block` with `attrs`.
   *
   * @param {Object|Block} attrs
   * @return {Block}
   */

  static create(attrs = {}) {
    if (Block.isBlock(attrs)) return attrs
    if (Inline.isInline(attrs)) return attrs
    if (Text.isText(attrs)) return attrs

    if (!attrs.type) {
      throw new Error('You must pass a block `type`.')
    }

    const { nodes } = attrs
    const empty = !nodes || nodes.size == 0 || nodes.length == 0
    const block = new Block({
      type: attrs.type,
      key: attrs.key || generateKey(),
      data: Data.create(attrs.data),
      isVoid: !!attrs.isVoid,
      nodes: Node.createList(empty ? [Text.create()] : nodes),
    })

    return block
  }

  /**
   * Create a list of `Blocks` from `elements`.
   *
   * @param {Array<Object|Block>|List<Block>} elements
   * @return {List<Block>}
   */

  static createList(elements = []) {
    if (List.isList(elements)) {
      return elements
    }

    if (Array.isArray(elements)) {
      const list = new List(elements.map(Block.create))
      return list
    }

    throw new Error(`Block.createList() must be passed an \`Array\` or a \`List\`. You passed: ${elements}`)
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
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'block'
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
