/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <block type="paragraph">
    <mark type="bold">
      w<mark type="italic">or</mark>d
    </mark>
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
          object: 'leaf',
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
          object: 'leaf',
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
    },
  ],
}
