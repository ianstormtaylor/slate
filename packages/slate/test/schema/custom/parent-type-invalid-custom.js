/** @jsx h */

import { PARENT_TYPE_INVALID } from '@gitbook/slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { types: ['list'] },
      normalize: (change, reason, { node }) => {
        if (reason == PARENT_TYPE_INVALID) {
          change.wrapBlockByKey(node.key, 'list')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <item />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <list>
          <item />
        </list>
      </paragraph>
    </document>
  </value>
)
