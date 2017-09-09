
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Node from '../models/node'
import Range from '../models/range'
import Selection from '../models/selection'
import State from '../models/state'
import Text from '../models/text'
import logger from '../utils/logger'

/**
 * Raw.
 *
 * @type {Object}
 */

const Raw = {

  /**
   * Deserialize a JSON `object`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserialize(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return State.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `Block`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Block}
   */

  deserializeBlock(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Block.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `Document`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Document}
   */

  deserializeDocument(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Document.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing an `Inline`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Inline}
   */

  deserializeInline(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Inline.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `Mark`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Mark}
   */

  deserializeMark(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Mark.fromJSON(object)
  },

  /**
   * Deserialize a JSON object representing a `Node`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Node}
   */

  deserializeNode(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Node.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `Range`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {List<Character>}
   */

  deserializeRange(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Range.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `Selection`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserializeSelection(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Selection.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `State`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserializeState(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return State.fromJSON(object)
  },

  /**
   * Deserialize a JSON `object` representing a `Text`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Text}
   */

  deserializeText(object, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return Text.fromJSON(object)
  },

  /**
   * Serialize a `model`.
   *
   * @param {Mixed} model
   * @param {Object} options (optional)
   * @return {Object}
   */

  serialize(model, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return model.toJSON(options)
  },

  /**
   * Serialize a `block` node.
   *
   * @param {Block} block
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeBlock(block, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return block.toJSON(options)
  },

  /**
   * Serialize a `document`.
   *
   * @param {Document} document
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeDocument(document, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return document.toJSON(options)
  },

  /**
   * Serialize an `inline` node.
   *
   * @param {Inline} inline
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeInline(inline, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return inline.toJSON(options)
  },

  /**
   * Serialize a `mark`.
   *
   * @param {Mark} mark
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeMark(mark, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return mark.toJSON()
  },

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeNode(node, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return node.toJSON(options)
  },

  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeRange(range, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return range.toJSON()
  },

  /**
   * Serialize a `selection`.
   *
   * @param {Selection} selection
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeSelection(selection, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return selection.toJSON(options)
  },

  /**
   * Serialize a `state`.
   *
   * @param {State} state
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeState(state, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return state.toJSON(options)
  },

  /**
   * Serialize a `text` node.
   *
   * @param {Text} text
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeText(text, options = {}) {
    if (options.terse) {
      logger.deprecate('0.23.0', 'The `terse` option for raw serialization is no longer supported.')
    }

    return text.toJSON(options)
  },

}

/**
 * Export.
 *
 * @type {Object}
 */

export default Raw
