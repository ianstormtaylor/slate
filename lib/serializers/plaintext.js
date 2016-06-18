
import Character from '../models/character'
import Node from '../models/node'
import Text from '../models/text'
import State from '../models/state'

/**
 * Serialize a `state` into a plaintext `string`.
 *
 * @param {State} state
 * @return {String} string
 */

function serialize(state) {
  return state.nodes
    .map(node => node.text)
    .join('\n')
}

/**
 * Deserialize a plaintext `string` into a `state`.
 *
 * @param {String} string
 * @return {State} state
 */

function deserialize(string) {
  const characters = string
    .split('')
    .reduce((list, char) => {
      return list.push(Character.create({ text: char }))
    }, Character.createList())

  const text = Text.create({ characters })
  const texts = Node.createMap([text])
  const node = Node.create({
    type: 'paragraph',
    nodes: texts,
  })

  const nodes = Node.createMap([node])
  const state = State.create({ nodes })
  return state
}

/**
 * Export.
 */

export default {
  serialize,
  deserialize
}
