
import Block from '../models/block'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import Range from '../models/range'
import Selection from '../models/selection'
import State from '../models/state'
import Text from '../models/text'
import isEmpty from 'is-empty'
import logger from '../utils/logger'

/**
 * Deprecation helper.
 */

let logged = false

function deprecate(options) {
  if (logged) {
    return
  }

  if (options.terse) {
    logger.deprecate('0.23.0', 'The `terse` option for raw serialization is deprecated and will be removed in a future release.')
  }

  logger.deprecate('0.23.0', 'The `Raw` serializer is deprecated, please use `Model.fromJSON` and `model.toJSON` instead.')
  logged = true
}

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
    return Raw.deserializeState(object, options)
  },

  /**
   * Deserialize a JSON `object` representing a `Block`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Block}
   */

  deserializeBlock(object, options = {}) {
    deprecate(options)

    if (options.terse) {
      object = Raw.untersifyBlock(object)
      object.nodes = object.nodes.map(node => Raw.deserializeNode(node, options))
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
    deprecate(options)

    if (options.terse) {
      object.nodes = object.nodes.map(node => Raw.deserializeNode(node, options))
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
    deprecate(options)

    if (options.terse) {
      object = Raw.untersifyInline(object)
      object.nodes = object.nodes.map(node => Raw.deserializeNode(node, options))
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
    deprecate(options)
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
    switch (object.kind) {
      case 'block': return Raw.deserializeBlock(object, options)
      case 'document': return Raw.deserializeDocument(object, options)
      case 'inline': return Raw.deserializeInline(object, options)
      case 'text': return Raw.deserializeText(object, options)
      default: {
        throw new Error(`Unrecognized node kind "${object.kind}".`)
      }
    }
  },

  /**
   * Deserialize a JSON `object` representing a `Range`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {List<Character>}
   */

  deserializeRange(object, options = {}) {
    deprecate(options)

    if (options.terse) {
      object = Raw.untersifyRange(object)
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
    deprecate(options)
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
    deprecate(options)

    if (options.terse) {
      object = Raw.untersifyState(object)
      object.document = Raw.deserializeDocument(object.document, options)
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
    deprecate(options)

    if (options.terse) {
      object = Raw.untersifyText(object)
      object.ranges = object.ranges.map(range => Raw.deserializeRange(range, options))
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
    deprecate(options)
    return Raw.serializeState(model, options)
  },

  /**
   * Serialize a `block` node.
   *
   * @param {Block} block
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeBlock(block, options = {}) {
    deprecate(options)
    let object = block.toJSON(options)

    if (options.terse) {
      object.nodes = block.nodes.toArray().map(node => Raw.serializeNode(node, options))
      object = Raw.tersifyBlock(object)
    }

    return object
  },

  /**
   * Serialize a `document`.
   *
   * @param {Document} document
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeDocument(document, options = {}) {
    deprecate(options)
    let object = document.toJSON(options)

    if (options.terse) {
      object.nodes = document.nodes.toArray().map(node => Raw.serializeNode(node, options))
      object = Raw.tersifyDocument(object)
    }

    return object
  },

  /**
   * Serialize an `inline` node.
   *
   * @param {Inline} inline
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeInline(inline, options = {}) {
    deprecate(options)
    let object = inline.toJSON(options)

    if (options.terse) {
      object.nodes = inline.nodes.toArray().map(node => Raw.serializeNode(node, options))
      object = Raw.tersifyInline(object)
    }

    return object
  },

  /**
   * Serialize a `mark`.
   *
   * @param {Mark} mark
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeMark(mark, options = {}) {
    deprecate(options)
    let object = mark.toJSON()

    if (options.terse) {
      object = Raw.tersifyMark(object)
    }

    return object
  },

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeNode(node, options = {}) {
    deprecate(options)
    switch (node.kind) {
      case 'block': return Raw.serializeBlock(node, options)
      case 'document': return Raw.serializeDocument(node, options)
      case 'inline': return Raw.serializeInline(node, options)
      case 'text': return Raw.serializeText(node, options)
      default: {
        throw new Error(`Unrecognized node kind "${node.kind}".`)
      }
    }
  },

  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeRange(range, options = {}) {
    deprecate(options)
    let object = range.toJSON()

    if (options.terse) {
      object.marks = range.marks.toArray().map(mark => Raw.serializeMark(mark, options))
      object = Raw.tersifyRange(object)
    }

    return object
  },

  /**
   * Serialize a `selection`.
   *
   * @param {Selection} selection
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeSelection(selection, options = {}) {
    deprecate(options)
    let object = selection.toJSON(options)

    if (options.terse) {
      object = Raw.tersifySelection(object)
    }

    return object
  },

  /**
   * Serialize a `state`.
   *
   * @param {State} state
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeState(state, options = {}) {
    deprecate(options)
    let object = state.toJSON(options)

    if (options.terse) {
      object.document = Raw.serializeDocument(state.document, options)
      object = Raw.tersifyState(object)
    }

    return object
  },

  /**
   * Serialize a `text` node.
   *
   * @param {Text} text
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeText(text, options = {}) {
    deprecate(options)
    let object = text.toJSON(options)

    if (options.terse) {
      object.ranges = text.getRanges().toArray().map(range => Raw.serializeRange(range, options))
      object = Raw.tersifyText(object)
    }

    return object
  },

  /**
   * Create a terse representation of a block `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyBlock(object) {
    const ret = {}
    ret.kind = object.kind
    ret.type = object.type
    if (object.key) ret.key = object.key
    if (!object.isVoid) ret.nodes = object.nodes
    if (object.isVoid) ret.isVoid = object.isVoid
    if (!isEmpty(object.data)) ret.data = object.data
    return ret
  },

  /**
   * Create a terse representation of a document `object.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyDocument(object) {
    const ret = {}
    ret.nodes = object.nodes
    if (object.key) ret.key = object.key
    if (!isEmpty(object.data)) ret.data = object.data
    return ret
  },

  /**
   * Create a terse representation of a inline `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyInline(object) {
    const ret = {}
    ret.kind = object.kind
    ret.type = object.type
    if (object.key) ret.key = object.key
    if (!object.isVoid) ret.nodes = object.nodes
    if (object.isVoid) ret.isVoid = object.isVoid
    if (!isEmpty(object.data)) ret.data = object.data
    return ret
  },

  /**
   * Create a terse representation of a mark `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyMark(object) {
    const ret = {}
    ret.type = object.type
    if (!isEmpty(object.data)) ret.data = object.data
    return ret
  },

  /**
   * Create a terse representation of a range `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyRange(object) {
    const ret = {}
    ret.text = object.text
    if (!isEmpty(object.marks)) ret.marks = object.marks
    return ret
  },

  /**
   * Create a terse representation of a selection `object.`
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifySelection(object) {
    return {
      anchorKey: object.anchorKey,
      anchorOffset: object.anchorOffset,
      focusKey: object.focusKey,
      focusOffset: object.focusOffset,
      isFocused: object.isFocused,
    }
  },

  /**
   * Create a terse representation of a state `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyState(object) {
    const { data, document, selection } = object
    const emptyData = isEmpty(data)

    if (!selection && emptyData) {
      return document
    }

    const ret = { document }
    if (!emptyData) ret.data = data
    if (selection) ret.selection = selection
    return ret
  },

  /**
   * Create a terse representation of a text `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyText(object) {
    const ret = {}
    ret.kind = object.kind
    if (object.key) ret.key = object.key

    if (object.ranges.length == 1 && object.ranges[0].marks == null) {
      ret.text = object.ranges[0].text
    } else {
      ret.ranges = object.ranges
    }

    return ret
  },

  /**
   * Convert a terse representation of a block `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyBlock(object) {
    if (object.isVoid || !object.nodes || !object.nodes.length) {
      return {
        key: object.key,
        data: object.data,
        kind: object.kind,
        type: object.type,
        isVoid: object.isVoid,
        nodes: [
          {
            kind: 'text',
            text: ''
          }
        ]
      }
    }

    return object
  },

  /**
   * Convert a terse representation of a inline `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyInline(object) {
    if (object.isVoid || !object.nodes || !object.nodes.length) {
      return {
        key: object.key,
        data: object.data,
        kind: object.kind,
        type: object.type,
        isVoid: object.isVoid,
        nodes: [
          {
            kind: 'text',
            text: ''
          }
        ]
      }
    }

    return object
  },

  /**
   * Convert a terse representation of a range `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyRange(object) {
    return {
      kind: 'range',
      text: object.text,
      marks: object.marks || []
    }
  },

  /**
   * Convert a terse representation of a selection `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifySelection(object) {
    return {
      kind: 'selection',
      anchorKey: object.anchorKey,
      anchorOffset: object.anchorOffset,
      focusKey: object.focusKey,
      focusOffset: object.focusOffset,
      isBackward: null,
      isFocused: false
    }
  },

  /**
   * Convert a terse representation of a state `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyState(object) {
    if (object.document) {
      return {
        kind: 'state',
        data: object.data,
        document: object.document,
        selection: object.selection,
      }
    }

    return {
      kind: 'state',
      document: {
        data: object.data,
        key: object.key,
        kind: 'document',
        nodes: object.nodes
      }
    }
  },

  /**
   * Convert a terse representation of a text `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyText(object) {
    if (object.ranges) return object

    return {
      key: object.key,
      kind: object.kind,
      ranges: [{
        text: object.text,
        marks: object.marks || []
      }]
    }
  },

}

/**
 * Export.
 *
 * @type {Object}
 */

export default Raw
