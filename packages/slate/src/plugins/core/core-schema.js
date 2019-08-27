import Schema from '../schema'
import Text from '../../models/text'
import Path from '../../utils/path-utils'

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
          const { code, path } = error

          if (code === 'child_min_invalid') {
            const text = Text.create()
            editor.insertNodeByPath(path, text)
          }
        },
      },

      // Ensure that inline nodes are surrounded by text nodes.
      {
        match: { object: 'block' },
        first: [{ object: 'block' }, { object: 'text' }],
        last: [{ object: 'block' }, { object: 'text' }],
        normalize: (editor, error) => {
          const { code, path } = error
          let targetPath

          if (code === 'first_child_object_invalid') {
            targetPath = path
          } else if (code === 'last_child_object_invalid') {
            targetPath = Path.increment(path)
          } else {
            return
          }

          const text = Text.create()
          editor.insertNodeByPath(targetPath, text)
        },
      },
      {
        match: { object: 'inline' },
        first: [{ object: 'block' }, { object: 'text' }],
        last: [{ object: 'block' }, { object: 'text' }],
        previous: [{ object: 'block' }, { object: 'text' }],
        next: [{ object: 'block' }, { object: 'text' }],
        normalize: (editor, error) => {
          const { code, path } = error
          let targetPath

          if (
            code === 'first_child_object_invalid' ||
            code === 'next_sibling_object_invalid'
          ) {
            targetPath = path
          } else if (
            code === 'last_child_object_invalid' ||
            code === 'previous_sibling_object_invalid'
          ) {
            targetPath = Path.increment(path)
          } else {
            return
          }

          const text = Text.create()
          editor.insertNodeByPath(targetPath, text)
        },
      },

      // Merge adjacent text nodes with the same marks.
      {
        match: { object: 'text' },
        next: (next, match) => {
          return next.object !== 'text' || !match.marks.equals(next.marks)
        },
        normalize: (editor, error) => {
          const { code, path } = error

          if (code === 'next_sibling_invalid') {
            editor.mergeNodeByPath(path)
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
          const { code, path } = error

          if (
            code === 'next_sibling_invalid' ||
            code === 'previous_sibling_invalid'
          ) {
            editor.removeNodeByPath(path)
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
