
import Block from '../models/block'
import Character from '../models/character'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import State from '../models/state'
import Text from '../models/text'
import groupByMarks from '../utils/group-by-marks'

/**
 * Serialize a `state`.
 *
 * @param {State} state
 * @return {Object} object
 */

function serialize(state) {
  return serializeNode(state.document)
}

/**
 * Serialize a `node`.
 *
 * @param {Node} node
 * @return {Object} object
 */

function serializeNode(node) {
  switch (node.kind) {
    case 'document': {
      return {
        nodes: node.nodes.toArray().map(child => serializeNode(child))
      }
    }
    case 'text': {
      return {
        kind: node.kind,
        ranges: serializeCharacters(node.characters)
      }
    }
    case 'block':
    case 'inline': {
      const obj = {}
      obj.kind = node.kind
      obj.type = node.type
      obj.nodes = node.nodes.toArray().map(child => serializeNode(child))
      if (node.isVoid) obj.isVoid = node.isVoid
      if (node.data.size) obj.data = node.data.toJSON()
      return obj
    }
    default: {
      throw new Error(`Unknown node kind "${node.kind}".`)
    }
  }
}

/**
 * Serialize a list of `characters`.
 *
 * @param {List} characters
 * @return {Array}
 */

function serializeCharacters(characters) {
  return groupByMarks(characters)
    .toArray()
    .map((range) => {
      const obj = {}
      obj.text = range.text
      if (range.marks.size) obj.marks = range.marks.toArray().map(serializeMark)
      return obj
    })
}

/**
 * Serialize a `mark`.
 *
 * @param {Mark} mark
 * @return {Object} Object
 */

function serializeMark(mark) {
  const obj = {}
  obj.type = mark.type
  if (mark.data.size) obj.data = mark.data.toJSON()
  return obj
}

/**
 * Deserialize a state JSON `object`.
 *
 * @param {Object} object
 * @return {State} state
 */

function deserialize(object) {
  return State.create({
    document: Document.create({
      nodes: Block.createList(object.nodes.map(deserializeNode))
    })
  })
}

/**
 * Deserialize a node JSON `object`.
 *
 * @param {Object} object
 * @return {Node} node
 */

function deserializeNode(object) {
  switch (object.kind) {
    case 'block': {
      return Block.create({
        type: object.type,
        data: object.data,
        isVoid: object.isVoid,
        nodes: Block.createList((object.nodes || []).map(deserializeNode))
      })
    }
    case 'inline': {
      return Inline.create({
        type: object.type,
        data: object.data,
        isVoid: object.isVoid,
        nodes: Inline.createList((object.nodes || []).map(deserializeNode))
      })
    }
    case 'text': {
      return Text.create({
        characters: object.ranges ? deserializeRanges(object.ranges) : ''
      })
    }
    default: {
      throw new Error(`Unknown node kind "${object.kind}".`)
    }
  }
}

/**
 * Deserialize a JSON `array` of ranges.
 *
 * @param {Array} array
 * @return {List} characters
 */

function deserializeRanges(array) {
  return array.reduce((characters, object) => {
    const marks = object.marks || []
    const chars = object.text
      .split('')
      .map((char) => {
        return Character.create({
          text: char,
          marks: Mark.createSet(marks.map(deserializeMark))
        })
      })

    return characters.push(...chars)
  }, Character.createList())
}

/**
 * Deserialize a mark JSON `object`.
 *
 * @param {Object} object
 * @return {Mark} mark
 */

function deserializeMark(object) {
  return Mark.create(object)
}

/**
 * Export.
 */

export default {
  serialize,
  serializeCharacters,
  serializeMark,
  serializeNode,
  deserialize,
  deserializeNode,
  deserializeRanges
}
