/** @jsx h */

import h from '../'
import assert from 'assert'
import { Document, Block, Text } from 'slate'


describe('slate-hyperscript', () => {
  it('should create a document with a single block', () => {
    const output = (
        <document>
            <block type="paragraph">
                Single block
            </block>
        </document>
    )
    const expected = Document.create({
      nodes: [
        Block.create({
          type: 'paragraph',
          nodes: [
            Text.createFromString('Single block')
          ]
        })
      ]
    })

    assert.deepEqual(output.toJSON(), expected.toJSON())
  })
})
