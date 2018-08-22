/** @jsx h */

import h from '../../../helpers/h'

export const skip = true

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
    key: '3',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        key: '1',
        data: {},
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
  selection: {
    object: 'selection',
    anchor: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 0,
    },
    focus: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 0,
    },
    isFocused: false,
    marks: null,
  },
}

export const options = {
  preserveKeys: true,
  preserveSelection: true,
}
