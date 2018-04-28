/** @jsx h */

import {
  PARENT_TYPE_INVALID,
  CHILD_TYPE_INVALID,
} from 'slate-schema-violations'
import { Block } from '../../..'
import h from '../../helpers/h'

/*
 * This test implements a schema with restrictions on both the parent and the children.
 * If the parent is invalid, the node's children are unwrapped.
 * If the node's children are invalid, they're removed and a valid node is inserted.
 *
 * The "parent_type_invalid" violation must be raised before "child_type_invalid" for the test to pass.
 */

export const schema = {
  blocks: {
    item: {
      parent: { types: ['list'] },
      nodes: [{ types: ['paragraph'] }],
      normalize: (change, reason, { node }) => {
        if (reason == PARENT_TYPE_INVALID) {
          change.withoutNormalization(c => {
            node.nodes.forEach(child => {
              c.unwrapNodeByKey(child.key)
            })
          })
        }

        if (reason == CHILD_TYPE_INVALID) {
          change.withoutNormalization(c => {
            node.nodes.forEach(child => c.removeNodeByKey(child.key))
            c.insertNodeByKey(node.key, 0, Block.create('paragraph'))
          })
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <item>Some text content.</item>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>Some text content.</paragraph>
    </document>
  </value>
)
