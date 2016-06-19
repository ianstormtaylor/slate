
import Character from '../models/character'
import Document from '../models/document'
import Mark from '../models/mark'
import Node from '../models/node'
import Text from '../models/text'
import State from '../models/state'
import xor from 'lodash/xor'
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
  switch (node.type) {
    case 'document': {
      return {
        nodes: node.nodes.toArray().map(node => serializeNode(node))
      }
    }
    case 'text': {
      return {
        type: 'text',
        ranges: serializeCharacters(node.characters)
      }
    }
    default: {
      return {
        type: node.type,
        data: node.data.toJSON(),
        nodes: node.nodes.toArray().map(node => serializeNode(node))
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
  return characters
    .toArray()
    .reduce((ranges, char, i) => {
      const previous = i == 0 ? null : characters.get(i - 1)
      const { text } = char
      const marks = char.marks.toArray().map(mark => serializeMark(mark))

      if (previous) {
        const previousMarks = previous.marks.toArray()
        const diff = xor(marks, previousMarks)
        if (!diff.length) {
          const previousRange = ranges[ranges.length - 1]
          previousRange.text += text
          return ranges
        }
      }

      const offset = ranges.map(range => range.text).join('').length
      ranges.push({ text, marks, offset })
      return ranges
    }, [])
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
      nodes: Node.createMap(object.nodes.map(deserializeNode))
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
  switch (object.type) {
    case 'text': {
      return Text.create({
        characters: deserializeRanges(object.ranges)
      })
    }
    default: {
      return Node.create({
        type: object.type,
        data: new Map(object.data),
        nodes: Node.createMap(object.nodes.map(deserializeNode))
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
          marks: Mark.createList(marks.map(deserializeMark))
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
