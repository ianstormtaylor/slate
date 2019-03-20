/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        o<cursor />ne
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
    ],
  },
  selection: {
    object: 'selection',
    anchor: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 1,
    },
    focus: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 1,
    },
    isFocused: true,
    marks: null,
  },
}
