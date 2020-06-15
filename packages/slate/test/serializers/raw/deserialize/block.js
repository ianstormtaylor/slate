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
            text: 'one',
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
      <paragraph>one</paragraph>
    </document>
  </value>
)
