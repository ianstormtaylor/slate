
import Raw from '../serializers/raw'

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toRaw
 * @return {State}
 */

function deserialize(string, options = {}) {
  const raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: string.split('\n').map((line) => {
        return {
          kind: 'block',
          type: 'line',
          nodes: [
            {
              kind: 'text',
              ranges: [
                {
                  text: line,
                  marks: [],
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
 * Checks if the block has other blocks nested within
 * @param  {Node}     node
 * @return {Boolean}
*/

function hasNestedBlocks(node) {
  return node &&
    node.nodes &&
    node.nodes.first() &&
    node.nodes.first().kind &&
    node.nodes.first().kind == 'block'
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
 * For blocks, or document, it recursively calls itself
 * to aggregate the text.
 * For other types of nodes, it uses the .text property
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node) {
  if (node.kind == 'document' || (node.kind == 'block' && hasNestedBlocks(node))) {
    return node.nodes
      .map(childNode => serializeNode(childNode))
      .filter(text => text != '')
      .join('\n')
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
