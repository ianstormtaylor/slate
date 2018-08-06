/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one
        <inline type="link">
          t<cursor />wo
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
    key: '6',
    nodes: [
      {
        object: 'block',
        key: '4',
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
                text: 'one',
                marks: [],
              },
            ],
          },
          {
            object: 'inline',
            key: '1',
            type: 'link',
            isVoid: false,
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
    object: 'range',
    anchor: {
      object: 'point',
      key: '0',
      path: [0, 1, 0],
      offset: 1,
    },
    focus: {
      object: 'point',
      key: '0',
      path: [0, 1, 0],
      offset: 1,
    },
    isFocused: true,
    isAtomic: false,
    marks: null,
  },
}
