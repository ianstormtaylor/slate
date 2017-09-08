
import Block from '../models/block'
import Raw from '../serializers/raw'

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toRaw
 *   @property {String|Object} defaultBlock
 *   @property {Array} defaultMarks
 * @return {State}
 */

function deserialize(string, options = {}) {
  const {
    defaultBlock = { type: 'line' },
    defaultMarks = [],
  } = options

  const raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: string.split('\n').map((line) => {
        return {
          ...defaultBlock,
          kind: 'block',
          nodes: [
            {
              kind: 'text',
              ranges: [
                {
                  text: line,
                  marks: defaultMarks,
                }
              ]
            }
          ]
        }
      }),
    }
  }

  return options.toRaw ? raw : Raw.deserialize(raw)
}

/**
 * Serialize a `state` to plain text.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state) {
  return serializeNode(state.document)
}

/**
 * Serialize a `node` to plain text.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node) {
  if (
    (node.kind == 'document') ||
    (node.kind == 'block' && Block.isBlockList(node.nodes))
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
  serialize
}
