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
  selection: {
    object: 'range',
    anchorKey: '0',
    anchorPath: [0, 0],
    anchorOffset: 0,
    focusKey: '0',
    focusPath: [0, 0],
    focusOffset: 0,
    isFocused: false,
    marks: null,
    isAtomic: false,
  },
}

export const options = {
  preserveKeys: true,
  preserveSelection: true,
}
