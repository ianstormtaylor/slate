/** @jsx h */

import { CHILD_REQUIRED } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          min: 2,
        },
      ],
      normalize: (change, { code, node, index }) => {
        if (code == CHILD_REQUIRED) {
          change.insertNodeByKey(node.key, index, {
            object: 'block',
            type: 'paragraph',
          })
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph />
        <paragraph />
      </quote>
    </document>
  </value>
)
