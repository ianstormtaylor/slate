
import Block from '../models/block'
import Character from '../models/character'
import Document from '../models/document'
import Inline from '../models/inline'
import Mark from '../models/mark'
import State from '../models/state'
import Text from '../models/text'
import groupByMarks from '../utils/group-by-marks'
import { Map } from 'immutable'

/**
 * Serialize a `state`.
 *
 * @param {State} state
 * @return {Object} object
 */

function serialize(state) {
  return {
    nodes: serializeNode(state.document)
  }
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
        nodes: node.nodes.toArray().map(node => serializeNode(node))
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
      return {
        data: node.data.toJSON(),
        kind: node.kind,
        nodes: node.nodes.toArray().map(node => serializeNode(node)),
        type: node.type
      }
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
      return {
        text: range.text,
        marks: range.marks.map(serializeMark)
      }
    })
}

/**
 * Serialize a `mark`.
 *
 * @param {Mark} mark
 * @return {Object} Object
 */

function serializeMark(mark) {
  return {
    type: mark.type,
    data: mark.data.toJSON()
  }
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
      nodes: Block.createMap(object.nodes.map(deserializeNode))
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
        data: new Map(object.data),
        nodes: Block.createMap(object.nodes.map(deserializeNode))
      })
    }
    case 'inline': {
      return Inline.create({
        type: object.type,
        data: new Map(object.data),
        nodes: Inline.createMap(object.nodes.map(deserializeNode))
      })
    }
    case 'text': {
      return Text.create({
        characters: deserializeRanges(object.ranges)
      })
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
      .map(char => {
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
  return Mark.create({
    type: object.type,
    data: new Map(object.data)
  })
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
