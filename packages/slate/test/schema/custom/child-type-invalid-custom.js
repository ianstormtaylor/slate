/** @jsx h */

import { CHILD_TYPE_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
        },
      ],
      normalize: (change, { code, child }) => {
        if (code == CHILD_TYPE_INVALID) {
          change.wrapBlockByKey(child.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <image />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <image />
        </paragraph>
      </quote>
    </document>
  </value>
)
