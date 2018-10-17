/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one
        <mark type="bold">
          two<cursor />
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
    key: '2',
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
              {
                object: 'leaf',
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
      offset: 6,
    },
    focus: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 6,
    },
    isFocused: true,
    marks: null,
  },
}
