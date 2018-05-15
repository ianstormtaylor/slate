/** @jsx h */

import { PARENT_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    quote: {
      parent: { objects: ['document'], types: ['quote'] },
      normalize: (change, reason, { node }) => {
        if (reason == PARENT_INVALID) {
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
        <quote>one</quote>
      </paragraph>
      <quote>
        <quote>two</quote>
      </quote>
      <quote>three</quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>one</quote>
      <quote>
        <quote>two</quote>
      </quote>
      <quote>three</quote>
    </document>
  </value>
)
