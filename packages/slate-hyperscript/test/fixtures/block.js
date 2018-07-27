/** @jsx h */

import h from '../..'

export const input = (
  <document>
    <block type="paragraph">word</block>
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
              text: 'word',
              marks: [],
            },
          ],
        },
      ],
    },
  ],
}
