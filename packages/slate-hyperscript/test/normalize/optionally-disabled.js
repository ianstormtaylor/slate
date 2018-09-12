/** @jsx h */

import h from '../..'
import { Value, Document, Block, Text } from '@gitbook/slate'

export const input = (
  <value normalize={false}>
    <document>
      <block type="paragraph">Valid block</block>
      <text>Invalid text</text>
    </document>
  </value>
)

export const output = Value.fromJSON(
  {
    document: Document.create({
      nodes: [
        Block.create({
          type: 'paragraph',
          nodes: [Text.create('Valid block')],
        }),
        Text.create('Invalid text'),
      ],
    }),
  },
  { normalize: false }
)
