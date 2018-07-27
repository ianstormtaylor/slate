/** @jsx h */

import { NODE_TEXT_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      text: /^\d*$/,
      normalize: (change, { code, node }) => {
        if (code == NODE_TEXT_INVALID) {
          node.nodes.forEach(n => change.removeNodeByKey(n.key))
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>123</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>123</paragraph>
    </document>
  </value>
)
