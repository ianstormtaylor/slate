/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <block type="paragraph">
    <mark type="bold">one</mark>two<mark type="italic">three</mark>
  </block>
)

export const output = {
  object: 'block',
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'text',
      text: 'one',
      marks: [
        {
          object: 'mark',
          type: 'bold',
          data: {},
        },
      ],
    },
    {
      object: 'text',
      text: 'two',
      marks: [],
    },
    {
      object: 'text',
      text: 'three',
      marks: [
        {
          object: 'mark',
          type: 'italic',
          data: {},
        },
      ],
    },
  ],
}
