/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph thing="value">one</paragraph>
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
        data: {
          thing: 'value',
        },
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
