/** @jsx h */

import { PARENT_OBJECT_INVALID } from '@gitbook/slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  inlines: {
    link: {
      parent: { objects: ['block'] },
      normalize: (change, reason, { node }) => {
        if (reason == PARENT_OBJECT_INVALID) {
          change.unwrapNodeByKey(node.key)
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <link>one</link>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
      </paragraph>
    </document>
  </value>
)
