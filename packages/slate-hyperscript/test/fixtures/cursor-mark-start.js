/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one
        <mark type="bold">
          <cursor />two
        </mark>
        three
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
    key: '4',
    nodes: [
      {
        object: 'block',
        key: '3',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            key: '1',
            text: 'one',
            marks: [],
          },
          {
            object: 'text',
            key: '0',
            text: 'two',
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
            key: '2',
            text: 'three',
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
      key: '0',
      path: [0, 1],
      offset: 0,
    },
    focus: {
      object: 'point',
      key: '0',
      path: [0, 1],
      offset: 0,
    },
    isFocused: true,
    marks: null,
  },
}
