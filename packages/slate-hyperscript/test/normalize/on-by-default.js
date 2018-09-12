/** @jsx h */

import h from '../..'
import { Value, Document, Block, Text } from '@gitbook/slate'

export const input = (
  <value>
    <document>
      <block type="paragraph">Valid block</block>
      <text>Invalid text</text>
    </document>
  </value>
)

export const output = Value.create({
  document: Document.create({
    nodes: [
      Block.create({
        type: 'paragraph',
        nodes: [Text.create('Valid block')],
      }),
    ],
  }),
})
