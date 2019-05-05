/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        <mark type="bold">one</mark>
        <cursor />two
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
    data: {},
    key: '3',
    nodes: [
      {
        object: 'block',
        key: '2',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text: 'one',
            key: '0',
            marks: [
              {
                object: 'mark',
                type: 'bold',
                data: {},
              },
            ],
          },
          {
            object: 'text',
            key: '1',
            text: 'two',
            marks: [],
          },
        ],
      },
    ],
  },
  selection: {
    object: 'selection',
    anchor: {
      object: 'point',
      key: '1',
      path: [0, 1],
      offset: 0,
    },
    focus: {
      object: 'point',
      key: '1',
      path: [0, 1],
      offset: 0,
    },
    isFocused: true,
    marks: null,
  },
}
