/** @jsx h */

import h from '../..'

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
      isVoid: false,
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
