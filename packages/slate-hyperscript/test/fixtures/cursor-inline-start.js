/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one
        <inline type="link">
          <cursor />two
        </inline>
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
    key: '5',
    nodes: [
      {
        object: 'block',
        key: '4',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            key: '2',
            leaves: [
              {
                object: 'leaf',
                text: 'one',
                marks: [],
              },
            ],
          },
          {
            object: 'inline',
            key: '1',
            type: 'link',
            data: {},
            nodes: [
              {
                object: 'text',
                key: '0',
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
            object: 'text',
            key: '3',
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
      path: [0, 1, 0],
      offset: 0,
    },
    focus: {
      object: 'point',
      key: '0',
      path: [0, 1, 0],
      offset: 0,
    },
    isFocused: true,
    marks: null,
  },
}
