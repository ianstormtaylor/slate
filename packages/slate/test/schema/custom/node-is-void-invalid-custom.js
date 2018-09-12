/** @jsx h */

import { NODE_IS_VOID_INVALID } from '@gitbook/slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      isVoid: false,
      normalize: (change, reason, { node }) => {
        if (reason == NODE_IS_VOID_INVALID) {
          change.removeNodeByKey(node.key, 'paragraph')
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block type="paragraph" isVoid />
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
