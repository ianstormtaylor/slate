/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <document>
    <block type="paragraph">
      Cat <inline type="link">is</inline>
      <text key="a"> cute</text>
    </block>
  </document>
)

export const options = {
  preserveKeys: true,
}

export const output = {
  object: 'document',
  key: '6',
  data: {},
  nodes: [
    {
      object: 'block',
      key: '4',
      type: 'paragraph',
      data: {},
      nodes: [
        {
          object: 'text',
          key: '2',
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
          key: '1',
          type: 'link',
          data: {},
          nodes: [
            {
              object: 'text',
              key: '0',
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
          key: 'a',
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
