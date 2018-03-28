/** @jsx h */

import { CHILD_REQUIRED } from 'slate-schema-violations'
import { Block } from '../../..'
import h from '../../helpers/h'

export const schema = {
  blocks: {
    quote: {
      nodes: [{ types: ['paragraph'], min: 1 }],
      normalize: (change, reason, { node }) => {
        if (reason == CHILD_REQUIRED) {
          change.insertNodeByKey(node.key, 0, Block.create('paragraph'))
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph />
      </quote>
    </document>
  </value>
)
