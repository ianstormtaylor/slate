
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Data from '../models/data'
import Mark from '../models/mark'
import Selection from '../models/selection'
import Text from '../models/text'
import typeOf from 'type-of'

/**
 * Normalize a block argument `value`.
 *
 * @param {Block || String || Object} value
 * @return {Block}
 */

function block(value) {
  if (value instanceof Block) return value

  switch (typeOf(value)) {
    case 'string':
    case 'object': {
      return Block.create(nodeProperties(value))
    }
    default: {
      throw new Error(`Invalid \`block\` argument! It must be a block, an object, or a string. You passed: "${value}".`)
    }
  }
}

/**
 * Normalize an inline argument `value`.
 *
 * @param {Inline || String || Object} value
 * @return {Inline}
 */

function inline(value) {
  if (value instanceof Inline) return value

  switch (typeOf(value)) {
    case 'string':
    case 'object': {
      return Inline.create(nodeProperties(value))
    }
    default: {
      throw new Error(`Invalid \`inline\` argument! It must be an inline, an object, or a string. You passed: "${value}".`)
    }
  }
}

/**
 * Normalize a key argument `value`.
 *
 * @param {String || Node} value
 * @return {String}
 */

function key(value) {
  if (value instanceof Block) return value.key
  if (value instanceof Document) return value.key
  if (value instanceof Inline) return value.key
  if (value instanceof Text) return value.key

  if (typeOf(value) == 'string') return value

  throw new Error(`Invalid \`key\` argument! It must be either a block, an inline, a text, or a string. You passed: "${value}".`)
}

/**
 * Normalize a mark argument `value`.
 *
 * @param {Mark || String || Object} value
 * @return {Mark}
 */

function mark(value) {
  if (value instanceof Mark) return value

  switch (typeOf(value)) {
    case 'string':
    case 'object': {
      return Mark.create(markProperties(value))
    }
    default: {
      throw new Error(`Invalid \`mark\` argument! It must be a mark, an object, or a string. You passed: "${value}".`)
    }
  }
}

/**
 * Normalize a mark properties argument `value`.
 *
 * @param {String || Object} value
 * @return {Object}
 */

function markProperties(value = {}) {
  const ret = {}

  switch (typeOf(value)) {
    case 'string': {
      ret.type = value
      break
    }
    case 'object': {
      for (const k in value) {
        if (k == 'data') {
          if (value[k] != null) ret[k] = Data.create(value[k])
        } else {
          ret[k] = value[k]
        }
      }
      break
    }
    default: {
      throw new Error(`Invalid mark \`properties\` argument! It must be an object or a string. You passed: "${value}".`)
    }
  }

  return ret
}

/**
 * Normalize a node properties argument `value`.
 *
 * @param {String || Object} value
 * @return {Object}
 */

function nodeProperties(value = {}) {
  const ret = {}

  switch (typeOf(value)) {
    case 'string': {
      ret.type = value
      break
    }
    case 'object': {
      if (value.isVoid != null) ret.isVoid = !!value.isVoid
      for (const k in value) {
        if (k == 'data') {
          if (value[k] != null) ret[k] = Data.create(value[k])
        } else {
          ret[k] = value[k]
        }
      }
      break
    }
    default: {
      throw new Error(`Invalid node \`properties\` argument! It must be an object or a string. You passed: "${value}".`)
    }
  }

  return ret
}

/**
 * Normalize a selection argument `value`.
 *
 * @param {Selection || Object} value
 * @return {Selection}
 */

function selection(value) {
  if (value instanceof Selection) return value

  switch (typeOf(value)) {
    case 'object': {
      return Selection.create(value)
    }
    default: {
      throw new Error(`Invalid \`selection\` argument! It must be a selection or an object. You passed: "${value}".`)
    }
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  block,
  inline,
  key,
  mark,
  markProperties,
  nodeProperties,
  selection,
}

