/** @jsx h */

import { CHILD_OBJECT_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [{ objects: ['block'] }],
      normalize: (change, reason, { child }) => {
        if (reason == CHILD_OBJECT_INVALID) {
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
