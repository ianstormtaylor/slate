/** @jsx h */

import { CHILD_REQUIRED } from 'slate-schema-violations'
import { Block } from '../../..'
import h from '../../helpers/h'

/*
 * This test implements a schema that ensures a "quote" has the following structure:
 * - (1) image
 * - (1) paragraph
 *
 * It MUST start with 1 "image" and that image MUST be followed by 1 "paragraph".
 * Extraneous "image"s/"paragraph"s are removed.
 *
 * If the "quote" contains an "image" but that image's order is incorrect,
 * the image will be moved to its expected index.
 * If the "quote" doesn't contain any "image", one is created and inserted where it's expected.
 * The same rule applies to "paragraph".
 */

const order = ['image', 'paragraph']

export const schema = {
  blocks: {
    quote: {
      nodes: order.map(type => ({ types: [type], min: 1, max: 1 })),
      normalize: (change, reason, { node }) => {
        if (reason == CHILD_REQUIRED) {
          order.forEach((type, index) => {
            if (node.nodes.has(index) && node.nodes.get(index).type === type) {
              // The node at "index" has the expected type
              return
            }

            const child = node.nodes.find(ch => ch.type === type)
            return child
              ? change.moveNodeByKey(child.key, node.key, index)
              : change.insertNodeByKey(node.key, index, Block.create(type))
          })
        }
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>Some text content.</paragraph>
        <image />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <image />
        <paragraph>Some text content.</paragraph>
      </quote>
    </document>
  </value>
)
