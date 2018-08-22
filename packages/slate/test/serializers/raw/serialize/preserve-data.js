/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)

export const output = {
  object: 'value',
  data: {},
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
            leaves: [
              {
                text: 'one',
                object: 'leaf',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}

export const options = {
  preserveData: true,
}
