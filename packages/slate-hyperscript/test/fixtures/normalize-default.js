/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">word</block>
      <text>invalid</text>
    </document>
  </value>
)

export const output = {
  object: 'value',
  document: {
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
  },
}
