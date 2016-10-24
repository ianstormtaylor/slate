
import Block from '../models/block'
import Character from '../models/character'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import State from '../models/state'
import Text from '../models/text'
import isEmpty from 'is-empty'

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
   * @return {Block}
   */

  deserialize(object, options) {
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
    if (options.terse) object = Raw.untersifyBlock(object)

    return Block.create({
      key: object.key,
      type: object.type,
      data: object.data,
      isVoid: object.isVoid,
      nodes: Block.createList(object.nodes.map((node) => {
        return Raw.deserializeNode(node, options)
      }))
    })
  },

  /**
   * Deserialize a JSON `object` representing a `Document`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Document}
   */

  deserializeDocument(object, options) {
    return Document.create({
      nodes: Block.createList(object.nodes.map((node) => {
        return Raw.deserializeNode(node, options)
      }))
    })
  },

  /**
   * Deserialize a JSON `object` representing an `Inline`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Inline}
   */

  deserializeInline(object, options = {}) {
    if (options.terse) object = Raw.untersifyInline(object)

    return Inline.create({
      key: object.key,
      type: object.type,
      data: object.data,
      isVoid: object.isVoid,
      nodes: Inline.createList(object.nodes.map((node) => {
        return Raw.deserializeNode(node, options)
      }))
    })
  },

  /**
   * Deserialize a JSON `object` representing a `Mark`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Mark} mark
   */

  deserializeMark(object, options) {
    return Mark.create(object)
  },

  /**
   * Deserialize a JSON object representing a `Node`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Text}
   */

  deserializeNode(object, options) {
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
   * @return {List}
   */

  deserializeRange(object, options = {}) {
    if (options.terse) object = Raw.untersifyRange(object)

    return Character.createList(object.text
      .split('')
      .map((char) => {
        return Character.create({
          text: char,
          marks: Mark.createSet(object.marks.map((mark) => {
            return Raw.deserializeMark(mark, options)
          }))
        })
      }))
  },

  /**
   * Deserialize a JSON `object` representing a `State`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {State}
   */

  deserializeState(object, options = {}) {
    if (options.terse) object = Raw.untersifyState(object)

    return State.create({
      document: Raw.deserializeDocument(object.document, options)
    })
  },

  /**
   * Deserialize a JSON `object` representing a `Text`.
   *
   * @param {Object} object
   * @param {Object} options (optional)
   * @return {Text}
   */

  deserializeText(object, options = {}) {
    if (options.terse) object = Raw.untersifyText(object)

    return Text.create({
      key: object.key,
      characters: object.ranges.reduce((characters, range) => {
        return characters.concat(Raw.deserializeRange(range, options))
      }, Character.createList())
    })
  },

  /**
   * Serialize a `model`.
   *
   * @param {Mixed} model
   * @param {Object} options (optional)
   * @return {Object}
   */

  serialize(model, options) {
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
    const object = {
      data: block.data.toJSON(),
      key: block.key,
      kind: block.kind,
      isVoid: block.isVoid,
      type: block.type,
      nodes: block.nodes
        .toArray()
        .map(node => Raw.serializeNode(node, options))
    }

    return options.terse
      ? Raw.tersifyBlock(object)
      : object
  },

  /**
   * Serialize a `document`.
   *
   * @param {Document} document
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeDocument(document, options = {}) {
    const object = {
      kind: document.kind,
      nodes: document.nodes
        .toArray()
        .map(node => Raw.serializeNode(node, options))
    }

    return options.terse
      ? Raw.tersifyDocument(object)
      : object
  },

  /**
   * Serialize an `inline` node.
   *
   * @param {Inline} inline
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeInline(inline, options = {}) {
    const object = {
      data: inline.data.toJSON(),
      key: inline.key,
      kind: inline.kind,
      isVoid: inline.isVoid,
      type: inline.type,
      nodes: inline.nodes
        .toArray()
        .map(node => Raw.serializeNode(node, options))
    }

    return options.terse
      ? Raw.tersifyInline(object)
      : object
  },

  /**
   * Serialize a `mark`.
   *
   * @param {Mark} mark
   * @param {Object} options (optional)
   * @return {Object} Object
   */

  serializeMark(mark, options = {}) {
    const object = {
      data: mark.data.toJSON(),
      kind: mark.kind,
      type: mark.type
    }

    return options.terse
      ? Raw.tersifyMark(object)
      : object
  },

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @param {Object} options (optional)
   * @return {Object} object
   */

  serializeNode(node, options) {
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
    const object = {
      kind: range.kind,
      text: range.text,
      marks: range.marks
        .toArray()
        .map(mark => Raw.serializeMark(mark, options))
    }

    return options.terse
      ? Raw.tersifyRange(object)
      : object
  },

  /**
   * Serialize a `state`.
   *
   * @param {State} state
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeState(state, options = {}) {
    const object = {
      document: Raw.serializeDocument(state.document, options),
      kind: state.kind
    }

    return options.terse
      ? Raw.tersifyState(object)
      : object
  },

  /**
   * Serialize a `text` node.
   *
   * @param {Text} text
   * @param {Object} options (optional)
   * @return {Object}
   */

  serializeText(text, options = {}) {
    const object = {
      key: text.key,
      kind: text.kind,
      ranges: text
        .getRanges()
        .toArray()
        .map(range => Raw.serializeRange(range, options))
    }

    return options.terse
      ? Raw.tersifyText(object)
      : object
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
    return {
      nodes: object.nodes
    }
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
   * Create a terse representation of a state `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyState(object) {
    return object.document
  },

  /**
   * Create a terse representation of a text `object`.
   *
   * @param {Object} object
   * @return {Object}
   */

  tersifyText(object) {
    if (object.ranges.length == 1 && object.ranges[0].marks == null) {
      return {
        kind: object.kind,
        text: object.ranges[0].text
      }
    }

    return {
      kind: object.kind,
      ranges: object.ranges
    }
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
   * Convert a terse representation of a state `object` into a non-terse one.
   *
   * @param {Object} object
   * @return {Object}
   */

  untersifyState(object) {
    return {
      kind: 'state',
      document: {
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
  }
}

/**
 * Export.
 */

export default Raw
