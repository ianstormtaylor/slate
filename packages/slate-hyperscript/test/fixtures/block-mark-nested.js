/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <block type="paragraph">
    <mark type="bold">w</mark>
    <mark type="bold">
      <mark type="italic">or</mark>
    </mark>
    <mark type="bold">d</mark>
  </block>
)

export const output = {
  object: 'block',
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'text',
      text: 'w',
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
      text: 'or',
      marks: [
        {
          object: 'mark',
          type: 'italic',
          data: {},
        },
        {
          object: 'mark',
          type: 'bold',
          data: {},
        },
      ],
    },
    {
      object: 'text',
      text: 'd',
      marks: [
        {
          object: 'mark',
          type: 'bold',
          data: {},
        },
      ],
    },
  ],
}
