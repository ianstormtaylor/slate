/** @jsx h */

import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: [{ type: 'paragraph' }],
      normalize: (change, { code, child }) => {
        if (code == LAST_CHILD_TYPE_INVALID) {
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
        <paragraph />
        <paragraph />
        <image />
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
        <paragraph>
          <image />
        </paragraph>
      </quote>
    </document>
  </value>
)
