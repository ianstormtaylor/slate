import AtCurrentRange from '../commands/at-current-range'
import AtRange from '../commands/at-range'
import ByPath from '../commands/by-path'
import Commands from './commands'
import OnHistory from '../commands/on-history'
import OnSelection from '../commands/on-selection'
import OnValue from '../commands/on-value'
import Queries from './queries'
import Schema from './schema'
import Text from '../models/text'

/**
 * A plugin that defines the core Slate logic.
 *
 * @param {Object} options
 * @return {Object}
 */

function CorePlugin(options = {}) {
  const { plugins = [] } = options

  /**
   * The core Slate commands.
   *
   * @type {Object}
   */

  const commands = Commands({
    ...AtCurrentRange,
    ...AtRange,
    ...ByPath,
    ...OnHistory,
    ...OnSelection,
    ...OnValue,
  })

  /**
   * The core Slate queries.
   *
   * @type {Object}
   */

  const queries = Queries({
    isAtomic: () => false,
    isVoid: () => false,
  })

  /**
   * The core Slate schema.
   *
   * @type {Object}
   */

  const schema = Schema({
    rules: [
      // Only allow block nodes in documents.
      {
        match: { object: 'document' },
        nodes: [
          {
            match: { object: 'block' },
          },
        ],
      },

      // Only allow block nodes or inline and text nodes in blocks.
      {
        match: {
          object: 'block',
          first: { object: 'block' },
        },
        nodes: [
          {
            match: { object: 'block' },
          },
        ],
      },
      {
        match: {
          object: 'block',
          first: [{ object: 'inline' }, { object: 'text' }],
        },
        nodes: [
          {
            match: [{ object: 'inline' }, { object: 'text' }],
          },
        ],
      },

      // Only allow inline and text nodes in inlines.
      {
        match: { object: 'inline' },
        nodes: [{ match: [{ object: 'inline' }, { object: 'text' }] }],
      },

      // Ensure that block and inline nodes have at least one text child.
      {
        match: [{ object: 'block' }, { object: 'inline' }],
        nodes: [{ min: 1 }],
        normalize: (change, error) => {
          const { code, node } = error

          if (code === 'child_required') {
            change.insertNodeByKey(node.key, 0, Text.create())
          }
        },
      },

      // Ensure that inline nodes are surrounded by text nodes.
      {
        match: { object: 'block' },
        first: [{ object: 'block' }, { object: 'text' }],
        last: [{ object: 'block' }, { object: 'text' }],
        normalize: (change, error) => {
          const { code, node } = error
          const text = Text.create()
          let i

          if (code === 'first_child_object_invalid') {
            i = 0
          } else if (code === 'last_child_object_invalid') {
            i = node.nodes.size
          } else {
            return
          }

          change.insertNodeByKey(node.key, i, text)
        },
      },
      {
        match: { object: 'inline' },
        first: [{ object: 'block' }, { object: 'text' }],
        last: [{ object: 'block' }, { object: 'text' }],
        previous: [{ object: 'block' }, { object: 'text' }],
        next: [{ object: 'block' }, { object: 'text' }],
        normalize: (change, error) => {
          const { code, node, index } = error
          const text = Text.create()
          let i

          if (code === 'first_child_object_invalid') {
            i = 0
          } else if (code === 'last_child_object_invalid') {
            i = node.nodes.size
          } else if (code === 'previous_sibling_object_invalid') {
            i = index
          } else if (code === 'next_sibling_object_invalid') {
            i = index + 1
          } else {
            return
          }

          change.insertNodeByKey(node.key, i, text)
        },
      },

      // Merge adjacent text nodes.
      {
        match: { object: 'text' },
        next: [{ object: 'block' }, { object: 'inline' }],
        normalize: (change, error) => {
          const { code, next } = error

          if (code === 'next_sibling_object_invalid') {
            change.mergeNodeByKey(next.key)
          }
        },
      },
    ],
  })

  /**
   * Return the plugins.
   *
   * @type {Array}
   */

  return [schema, ...plugins, commands, queries]
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CorePlugin
