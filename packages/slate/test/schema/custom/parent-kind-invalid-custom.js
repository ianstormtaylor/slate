/** @jsx h */

import { PARENT_OBJECT_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      parent: { object: 'document' },
      normalize: (change, { code, node }) => {
        if (code == PARENT_OBJECT_INVALID) {
          change.unwrapNodeByKey(node.key)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)
