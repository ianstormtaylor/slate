/** @jsx h */

import h from '../..'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one<text key="a">two</text>three
      </block>
    </document>
    <selection anchorKey="a" anchorOffset={1} focusKey="a" focusOffset={2} />
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
    key: '2',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '0',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            key: 'a',
            leaves: [
              {
                object: 'leaf',
                text: 'onetwothree',
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
    anchorKey: 'a',
    anchorPath: [0, 0],
    anchorOffset: 1,
    focusKey: 'a',
    focusPath: [0, 0],
    focusOffset: 2,
    isBackward: false,
    isFocused: false,
    isAtomic: false,
    marks: null,
  },
}
