/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <image />
    </document>
  </value>
)

export const output = {
  object: 'value',
  isFocused: false,
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'image',
        isVoid: true,
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
      },
    ],
  },
}
