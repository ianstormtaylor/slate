/** @jsx h */

import { NODE_DATA_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  plugins: [
    // Plugin that wraps a quote's content with "comment" inlines
    // if the quote has a "comment" data property (also removes that data property).
    {
      schema: {
        blocks: {
          quote: {
            data: {
              comment: value => value == null,
            },
            normalize(change, reason, context) {
              if (reason == NODE_DATA_INVALID) {
                change.setNodeByKey(context.node.key, {
                  data: context.node.data.delete('comment'),
                })
                context.node.nodes.forEach(child =>
                  change.wrapInlineByKey(child.key, 'comment')
                )
              }
            },
          },
        },
      },
    },

    // Plugin that removes all data from quote
    {
      validateNode(node) {
        if (node.type == 'quote' && node.data.size > 0) {
          return change => change.setNodeByKey(node.key, { data: {} })
        }
      },
    },
  ],
}

export const input = (
  <value>
    <document>
      <quote comment>This is a comment.</quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <comment>This is a comment.</comment>
      </quote>
    </document>
  </value>
)
