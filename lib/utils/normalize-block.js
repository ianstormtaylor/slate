
import Block from '../models/block'
import normalizeProperties from './normalize-node-or-mark-properties'
import typeOf from 'type-of'

/**
 * Normalize a `block` argument, which can be a string or plain object too.
 *
 * @param {Block or String or Object} block
 * @return {Block}
 */

function normalizeBlock(block) {
  if (block instanceof Block) return block

  const type = typeOf(block)

  switch (type) {
    case 'string':
    case 'object': {
      return Block.create(normalizeProperties(block))
    }
    default: {
      throw new Error(`A \`block\` argument must be a block, an object or a string, but you passed: "${type}".`)
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default normalizeBlock
