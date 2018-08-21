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
        type: 'paragraph',
        data: {
          thing: 'value',
        },
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'one',
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
      <paragraph thing="value">one</paragraph>
    </document>
  </value>
)
