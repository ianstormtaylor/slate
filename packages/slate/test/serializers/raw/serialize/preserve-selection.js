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
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        isVoid: false,
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
  selection: {
    object: 'range',
    anchorPath: [0, 0],
    anchorOffset: 0,
    focusPath: [0, 0],
    focusOffset: 0,
    isFocused: false,
    marks: null,
    isAtomic: false,
  },
}

export const options = {
  preserveSelection: true,
}
