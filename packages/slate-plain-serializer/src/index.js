import { Block, Mark, Node, Value } from '@gitbook/slate'
import { Set } from 'immutable'

/**
 * Deserialize a plain text `string` to a Slate value.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toJSON
 *   @property {String|Object|Block} defaultBlock
 *   @property {Array|Set} defaultMarks
 * @return {Value}
 */

function deserialize(string, options = {}) {
  let { defaultBlock = 'line', defaultMarks = [], toJSON = false } = options

  if (Set.isSet(defaultMarks)) {
    defaultMarks = defaultMarks.toArray()
  }

  defaultBlock = Node.createProperties(defaultBlock)
  defaultMarks = defaultMarks.map(Mark.createProperties)

  const json = {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: string.split('\n').map(line => {
        return {
          ...defaultBlock,
          object: 'block',
          isVoid: false,
          data: {},
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: line,
                  marks: defaultMarks,
                },
              ],
            },
          ],
        }
      }),
    },
  }

  const ret = toJSON ? json : Value.fromJSON(json)
  return ret
}

/**
 * Serialize a Slate `value` to a plain text string.
 *
 * @param {Value} value
 * @return {String}
 */

function serialize(value) {
  return serializeNode(value.document)
}

/**
 * Serialize a `node` to plain text.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node) {
  if (
    node.object == 'document' ||
    (node.object == 'block' && Block.isBlockList(node.nodes))
  ) {
    return node.nodes.map(serializeNode).join('\n')
  } else {
    return node.text
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  deserialize,
  serialize,
}
