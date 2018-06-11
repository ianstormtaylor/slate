/** @jsx h */

import assert from 'assert'

import h from '../..'

export const input = (
  <document>
    <block type="paragraph">
      Cat <inline type="link">is</inline>
      <text key="a"> cute</text>
    </block>
  </document>
)

export function test() {
  const block = input.nodes.first()
  assert.notEqual(block.nodes.first().key, 'a')
  assert.equal(block.nodes.last().key, 'a')
}

export const output = {
  object: 'document',
  data: {},
  nodes: [
    {
      object: 'block',
      type: 'paragraph',
      isVoid: false,
      data: {},
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: 'Cat ',
              marks: [],
            },
          ],
        },
        {
          object: 'inline',
          type: 'link',
          data: {},
          isVoid: false,
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: 'is',
                  marks: [],
                },
              ],
            },
          ],
        },
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: ' cute',
              marks: [],
            },
          ],
        },
      ],
    },
  ],
}
