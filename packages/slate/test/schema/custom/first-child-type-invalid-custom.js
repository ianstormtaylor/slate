/** @jsx h */

import { FIRST_CHILD_TYPE_INVALID } from '@gitbook/slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: { types: ['paragraph'] },
      normalize: (change, reason, { child }) => {
        if (reason == FIRST_CHILD_TYPE_INVALID) {
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
        <paragraph />
        <paragraph />
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
        <paragraph />
        <paragraph />
      </quote>
    </document>
  </value>
)
