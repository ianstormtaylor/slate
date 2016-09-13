
import Block from '../models/block'
import Document from '../models/document'
import State from '../models/state'
import Text from '../models/text'

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @return {State}
 */

function deserialize(string) {
  return State.create({
    document: Document.create({
      nodes: string.split('\n').map(deserializeLine)
    })
  })
}

/**
 * Deserialize a `line` of text.
 *
 * @param {String} line
 * @return {Block}
 */

function deserializeLine(line) {
  return Block.create({
    type: 'line',
    nodes: [
      Text.create({
        characters: line.split('').map(deserializeCharacter)
      })
    ]
  })
}

/**
 * Deserialize a `character`.
 *
 * @param {String} char
 * @return {Character}
 */

function deserializeCharacter(char) {
  return { text: char }
}

/**
 * Serialize a `state` to plain text.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state) {
  return state.document.nodes
    .map(block => block.text)
    .join('\n')
}

/**
 * Export.
 */

export default {
  deserialize,
  serialize
}
