/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one<text key="a">two</text>three
      </block>
    </document>
    <selection>
      <anchor key="a" offset={1} />
      <focus key="a" offset={2} />
    </selection>
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
    object: 'selection',
    anchor: {
      object: 'point',
      key: 'a',
      path: [0, 0],
      offset: 1,
    },
    focus: {
      object: 'point',
      key: 'a',
      path: [0, 0],
      offset: 2,
    },
    isFocused: false,
    marks: null,
  },
}
