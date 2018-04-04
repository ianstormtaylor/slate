/** @jsx h */

import h from '../'
import assert from 'assert'
import { Value, Document, Block, Text } from 'slate'

describe('slate-hyperscript', () => {
  it('should create a document with a single block', () => {
    const output = (
      <document>
        <block type="paragraph">Single block</block>
      </document>
    )
    const expected = Document.create({
      nodes: [
        Block.create({
          type: 'paragraph',
          nodes: [Text.create('Single block')],
        }),
      ],
    })

    assert.deepEqual(output.toJSON(), expected.toJSON())
  })

  it('should normalize a value by default', () => {
    const output = (
      <value>
        <document>
          <block type="paragraph">Valid block</block>
          <text>Invalid text</text>
        </document>
      </value>
    )
    const expected = Value.create({
      document: Document.create({
        nodes: [
          Block.create({
            type: 'paragraph',
            nodes: [Text.create('Valid block')],
          }),
        ],
      }),
    })

    assert.deepEqual(output.toJSON(), expected.toJSON())
  })

  it('should not normalize a value, given the option', () => {
    const output = (
      <value normalize={false}>
        <document>
          <block type="paragraph">Valid block</block>
          <text>Invalid text</text>
        </document>
      </value>
    )
    const expected = Value.fromJSON(
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

    assert.deepEqual(output.toJSON(), expected.toJSON())
  })
})
