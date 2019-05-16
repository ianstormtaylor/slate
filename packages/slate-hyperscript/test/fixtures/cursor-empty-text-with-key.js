/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        <text key="a">
          <cursor />
        </text>
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
    key: '2',
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
            key: 'a',
            text: '',
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
      key: 'a',
      path: [0, 0],
      offset: 0,
    },
    focus: {
      object: 'point',
      key: 'a',
      path: [0, 0],
      offset: 0,
    },
    isFocused: true,
    marks: null,
  },
}
