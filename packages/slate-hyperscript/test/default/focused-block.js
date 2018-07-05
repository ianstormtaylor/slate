/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document isFocused>
      <block type="paragraph">Cat is Cute</block>
    </document>
  </value>
)

export const output = {
  object: 'value',
  isFocused: true,
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
                text: 'Cat is Cute',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}
