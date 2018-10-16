/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <block type="paragraph">
    <text />
  </block>
)

export const output = {
  object: 'block',
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'text',
      leaves: [
        {
          object: 'leaf',
          text: '',
          marks: [],
        },
      ],
    },
  ],
}
