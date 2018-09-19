/** @jsx h */

import { CHILD_TYPE_INVALID } from '@gitbook/slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [{ types: ['paragraph'] }],
      normalize: (change, reason, { child }) => {
        if (reason == CHILD_TYPE_INVALID) {
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
