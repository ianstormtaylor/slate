
import logger from 'slate-dev-logger'
import { Block, Mark, Node, State } from 'slate'
import { Set } from 'immutable'

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toJSON
 *   @property {String|Object|Block} defaultBlock
 *   @property {Array|Set} defaultMarks
 * @return {State}
 */

function deserialize(string, options = {}) {
  let {
    defaultBlock = 'line',
    defaultMarks = [],
    toJSON = false,
  } = options

  if (options.toRaw) {
    logger.deprecate('0.23.0', 'The `options.toRaw` argument of the `Plain` serializer is deprecated, use `options.toJSON` instead.')
    toJSON = options.toRaw
  }

  if (Set.isSet(defaultMarks)) {
    defaultMarks = defaultMarks.toArray()
  }

  defaultBlock = Node.createProperties(defaultBlock)
  defaultMarks = defaultMarks.map(Mark.createProperties)

  const json = {
    kind: 'state',
    document: {
      kind: 'document',
      data: {},
      nodes: string.split('\n').map((line) => {
        return {
          ...defaultBlock,
          kind: 'block',
          isVoid: false,
          data: {},
          nodes: [
            {
              kind: 'text',
              ranges: [
                {
                  kind: 'range',
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

  const ret = toJSON ? json : State.fromJSON(json)
  return ret
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
