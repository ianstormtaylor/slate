/** @jsx h */

import { LAST_CHILD_OBJECT_INVALID } from '@gitbook/slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: { objects: ['block'] },
      normalize: (change, reason, { child }) => {
        if (reason == LAST_CHILD_OBJECT_INVALID) {
          change.wrapBlockByKey(child.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>text</quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>text</paragraph>
      </quote>
    </document>
  </value>
)
