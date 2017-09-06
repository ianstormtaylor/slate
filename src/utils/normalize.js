
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Data from '../models/data'
import Mark from '../models/mark'
import Selection from '../models/selection'
import Text from '../models/text'
import logger from './logger'
import typeOf from 'type-of'
import { Set } from 'immutable'

/**
 * Normalize a block argument `value`.
 *
 * @param {Block|String|Object} value
 * @return {Block}
 */

function block(value) {
  if (Block.isBlock(value)) return value

  if (
    Inline.isInline(value) ||
    Mark.isMark(value) ||
    Text.isText(value) ||
    Selection.isSelection(value)
  ) {
    throw new Error(`Invalid \`block\` argument! It must be a block, an object, or a string. You passed: ${value}`)
  }


  switch (typeOf(value)) {
    case 'string':
    case 'object': {
      return Block.create(nodeProperties(value))
    }
    default: {
      throw new Error(`Invalid \`block\` argument! It must be a block, an object, or a string. You passed: ${value}`)
    }
  }
}

/**
 * Normalize an inline argument `value`.
 *
 * @param {Inline|String|Object} value
 * @return {Inline}
 */

function inline(value) {
  if (Inline.isInline(value)) return value

  if (
    Block.isBlock(value) ||
    Mark.isMark(value) ||
    Text.isText(value) ||
    Selection.isSelection(value)
  ) {
    throw new Error(`Invalid \`inline\` argument! It must be an inline, an object, or a string. You passed: ${value}`)
  }

  switch (typeOf(value)) {
    case 'string':
    case 'object': {
      return Inline.create(nodeProperties(value))
    }
    default: {
      throw new Error(`Invalid \`inline\` argument! It must be an inline, an object, or a string. You passed: ${value}`)
    }
  }
}

/**
 * Normalize an text argument `value`.
 *
 * @param {Text|String|Object} value
 * @return {Text}
 */

function text(value) {
  if (Text.isText(value)) return value

  if (
    Block.isBlock(value) ||
    Inline.isInline(value) ||
    Mark.isMark(value) ||
    Selection.isSelection(value)
  ) {
    throw new Error(`Invalid \`text\` argument! It must be a text, an object, or a string. You passed: ${value}`)
  }

  switch (typeOf(value)) {
    case 'object': {
      return Text.create(value)
    }
    default: {
      throw new Error(`Invalid \`text\` argument! It must be an text, an object, or a string. You passed: ${value}`)
    }
  }
}

/**
 * Normalize a node `value`.
 *
 * @param {Node|Object} value
 * @return {Node}
 */

function node(value) {
  if (Block.isBlock(value)) return value
  if (Document.isDocument(value)) return value
  if (Inline.isInline(value)) return value
  if (Text.isText(value)) return value

  switch (typeOf(value)) {
    case 'object': {
      switch (value.kind) {
        case 'block': return block(value)
        case 'inline': return inline(value)
        case 'text': return text(value)
        default: {
          throw new Error(`Invalid \`node.kind\` property. It must be either "block" or "inline". You passed: ${value}`)
        }
      }
    }
    default: {
      throw new Error(`Invalid \`node\` argument! It must be a block, an inline, a text, or an object. You passed: ${value}`)
    }
  }
}

/**
 * Normalize a key argument `value`.
 *
 * @param {String|Node} value
 * @return {String}
 */

function key(value) {
  if (typeOf(value) == 'string') return value

  logger.warn('An object was passed to a Node method instead of a `key` string. This was previously supported, but is being deprecated because it can have a negative impact on performance. The object in question was:', value)

  if (
    Block.isBlock(value) ||
    Document.isDocument(value) ||
    Inline.isInline(value) ||
    Text.isText(value)
  ) {
    return value.key
  }

  throw new Error(`Invalid \`key\` argument! It must be either a block, an inline, a text, or a string. You passed: ${value}`)
}

/**
 * Normalize a mark argument `value`.
 *
 * @param {Mark|String|Object} value
 * @return {Mark}
 */

function mark(value) {
  if (Mark.isMark(value)) return value
  if (
    Block.isBlock(value) ||
    Inline.isInline(value) ||
    Text.isText(value) ||
    Selection.isSelection(value)
  ) {
    throw new Error(`Invalid \`mark\` argument! It must be a mark, an object, or a string. You passed: ${value}`)
  }

  switch (typeOf(value)) {
    case 'string':
    case 'object': {
      return Mark.create(markProperties(value))
    }
    default: {
      throw new Error(`Invalid \`mark\` argument! It must be a mark, an object, or a string. You passed: ${value}`)
    }
  }
}

/**
 * Normalize a set of marks argument `values`.
 *
 * @param {Set<Marks>|Array} values
 * @return {Set<Marks>}
 */

function marks(values) {
  if (Set.isSet(values)) return values

  switch (typeOf(values)) {
    case 'array': {
      return Mark.createSet(values)
    }
    case 'null': {
      return null
    }
    default: {
      throw new Error(`Invalid \`marks\` argument! It must be a set of marks or an array. You passed: ${values}`)
    }
  }
}

/**
 * Normalize a mark properties argument `value`.
 *
 * @param {String|Object|Mark} value
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
          if (value[k] !== undefined) ret[k] = Data.create(value[k])
        } else if (!k.startsWith('@@__SLATE')) {
          ret[k] = value[k]
        }
      }
      break
    }
    default: {
      throw new Error(`Invalid mark \`properties\` argument! It must be an object, a string or a mark. You passed: ${value}`)
    }
  }

  return ret
}

/**
 * Normalize a node properties argument `value`.
 *
 * @param {String|Object|Node} value
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
      if (value.isVoid !== undefined) ret.isVoid = !!value.isVoid
      for (const k in value) {
        if (k == 'data') {
          if (value[k] !== undefined) ret[k] = Data.create(value[k])
        } else if (!k.startsWith('@@__SLATE')) {
          ret[k] = value[k]
        }
      }
      break
    }
    default: {
      throw new Error(`Invalid node \`properties\` argument! It must be an object, a string or a node. You passed: ${value}`)
    }
  }

  return ret
}

/**
 * Normalize a selection argument `value`.
 *
 * @param {Selection|Object} value
 * @return {Selection}
 */

function selection(value) {
  if (Selection.isSelection(value)) return value
  if (
    Mark.isMark(value) ||
    Block.isBlock(value) ||
    Inline.isInline(value) ||
    Text.isText(value)
  ) {
    throw new Error(`Invalid \`selection\` argument! It must be a selection or an object. You passed: ${value}`)``
  }

  switch (typeOf(value)) {
    case 'object': {
      return Selection.create(value)
    }
    default: {
      throw new Error(`Invalid \`selection\` argument! It must be a selection or an object. You passed: ${value}`)
    }
  }
}

/**
 * Normalize a selection properties argument `value`.
 *
 * @param {Object|Selection} value
 * @return {Object}
 */

function selectionProperties(value = {}) {
  const ret = {}

  switch (typeOf(value)) {
    case 'object': {
      if (value.anchorKey !== undefined) ret.anchorKey = value.anchorKey
      if (value.anchorOffset !== undefined) ret.anchorOffset = value.anchorOffset
      if (value.focusKey !== undefined) ret.focusKey = value.focusKey
      if (value.focusOffset !== undefined) ret.focusOffset = value.focusOffset
      if (value.isBackward !== undefined) ret.isBackward = !!value.isBackward
      if (value.isFocused !== undefined) ret.isFocused = !!value.isFocused
      if (value.marks !== undefined) ret.marks = value.marks
      break
    }
    default: {
      throw new Error(`Invalid selection \`properties\` argument! It must be an object or a selection. You passed: ${value}`)
    }
  }

  return ret
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  block,
  inline,
  node,
  key,
  mark,
  marks,
  markProperties,
  nodeProperties,
  selection,
  selectionProperties,
  text,
}
