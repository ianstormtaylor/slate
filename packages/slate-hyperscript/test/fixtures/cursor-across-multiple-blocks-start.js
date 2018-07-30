/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        <anchor />one
      </block>
      <block type="paragraph">two</block>
      <block type="paragraph">
        <focus />three
      </block>
    </document>
  </value>
)

export const options = {
  preserveSelection: true,
  preserveKeys: true,
}

export const output = {
  object: 'value',
  document: {
    object: 'document',
    key: '9',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '1',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            key: '0',
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
      {
        object: 'block',
        key: '3',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            key: '2',
            leaves: [
              {
                object: 'leaf',
                text: 'two',
                marks: [],
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        key: '5',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            key: '4',
            leaves: [
              {
                object: 'leaf',
                text: 'three',
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
    focusKey: '4',
    focusPath: [2, 0],
    focusOffset: 0,
    isBackward: false,
    isFocused: true,
    isAtomic: false,
    marks: null,
  },
}
