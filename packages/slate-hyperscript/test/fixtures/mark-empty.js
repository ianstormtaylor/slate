/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <document>
    <block type="paragraph">
      <mark type="bold" />
    </block>
  </document>
)

export const output = {
  object: 'document',
  data: {},
  nodes: [
    {
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
              marks: [
                {
                  type: 'bold',
                  object: 'mark',
                  data: {},
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
