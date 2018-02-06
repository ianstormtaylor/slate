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
  document: {
    object: 'document',
    key: '4',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '1',
        type: 'paragraph',
        data: {},
        isVoid: false,
        nodes: [
          {
            object: 'text',
            key: '0',
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
  preserveKeys: true,
}
