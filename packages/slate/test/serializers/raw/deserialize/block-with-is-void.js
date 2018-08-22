/** @jsx h */

import h from '../../../helpers/h'

export const input = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'image',
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

export const output = (
  <value>
    <document>
      <image />
    </document>
  </value>
)
