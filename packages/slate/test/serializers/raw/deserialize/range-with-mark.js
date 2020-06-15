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
        data: {},
        nodes: [
          {
            object: 'text',
            text: 'o',
            marks: [],
          },
          {
            object: 'text',
            text: 'n',
            marks: [
              {
                object: 'mark',
                type: 'bold',
                data: {},
              },
            ],
          },
          {
            object: 'text',
            text: 'e',
            marks: [],
          },
        ],
      },
    ],
  },
}

export const output = (
  <value>
    <document>
      <paragraph>
        o<b>n</b>e
      </paragraph>
    </document>
  </value>
)
