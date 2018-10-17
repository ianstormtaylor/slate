import { Block, Mark, Node, Value } from 'slate'
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
  let {
    defaultBlock = 'line',
    defaultMarks = [],
    delimiter = '\n',
    toJSON = false,
  } = options

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
      nodes: string.split(delimiter).map(line => {
        return {
          ...defaultBlock,
          object: 'block',
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

function serialize(value, options = {}) {
  return serializeNode(value.document, options)
}

/**
 * Serialize a `node` to plain text.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node, options = {}) {
  const { delimiter = '\n' } = options

  if (
    node.object == 'document' ||
    (node.object == 'block' && Block.isBlockList(node.nodes))
  ) {
    return node.nodes.map(serializeNode).join(delimiter)
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
