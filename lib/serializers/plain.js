
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
  const characters = string.split('').map(char => {
    return { text: char }
  })

  const text = Text.create({ characters })
  const block = Block.create({
    type: 'paragraph',
    nodes: [text]
  })

  const document = Document.create({ nodes: [block] })
  const state = State.create({ document })
  return state
}

/**
 * Serialize a `state` to plain text.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state) {
  return state.blocks
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
