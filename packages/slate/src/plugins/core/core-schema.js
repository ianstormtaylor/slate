import Schema from '../schema'
import Text from '../../models/text'

/**
 * A plugin that defines the core Slate schema.
 *
 * @param {Object} options
 * @return {Object}
 */

function CoreSchemaPlugin(options = {}) {
  return Schema({
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
        normalize: (editor, error) => {
          const { code, node } = error

          if (code === 'child_min_invalid' && node.nodes.isEmpty()) {
            editor.insertNodeByKey(node.key, 0, Text.create())
          }
        },
      },

      // Ensure that inline nodes are surrounded by text nodes.
      {
        match: { object: 'block' },
        first: [{ object: 'block' }, { object: 'text' }],
        last: [{ object: 'block' }, { object: 'text' }],
        normalize: (editor, error) => {
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

          editor.insertNodeByKey(node.key, i, text)
        },
      },
      {
        match: { object: 'inline' },
        first: [{ object: 'block' }, { object: 'text' }],
        last: [{ object: 'block' }, { object: 'text' }],
        previous: [{ object: 'block' }, { object: 'text' }],
        next: [{ object: 'block' }, { object: 'text' }],
        normalize: (editor, error) => {
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

          editor.insertNodeByKey(node.key, i, text)
        },
      },

      // Merge adjacent text nodes with the same marks.
      {
        match: { object: 'text' },
        next: (next, match) => {
          return next.object !== 'text' || !match.marks.equals(next.marks)
        },
        normalize: (editor, error) => {
          const { code, next } = error

          if (code === 'next_sibling_invalid') {
            editor.mergeNodeByKey(next.key)
          }
        },
      },

      // Remove extra adjacent empty text nodes.
      {
        match: { object: 'text' },
        previous: prev => {
          return prev.object !== 'text' || prev.text !== ''
        },
        next: next => {
          return next.object !== 'text' || next.text !== ''
        },
        normalize: (editor, error) => {
          const { code, next, previous } = error

          if (code === 'next_sibling_invalid') {
            editor.removeNodeByKey(next.key)
          } else if (code === 'previous_sibling_invalid') {
            editor.removeNodeByKey(previous.key)
          }
        },
      },
    ],
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CoreSchemaPlugin
