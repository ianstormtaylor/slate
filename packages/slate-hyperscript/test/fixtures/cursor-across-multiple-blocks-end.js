/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one<anchor />
      </block>
      <block type="paragraph">two</block>
      <block type="paragraph">
        three<focus />
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
    key: '6',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '1',
        type: 'paragraph',
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
    object: 'selection',
    anchor: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 3,
    },
    focus: {
      object: 'point',
      key: '4',
      path: [2, 0],
      offset: 5,
    },
    isFocused: true,
    marks: null,
  },
}
