/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        <inline type="link">
          on<anchor />e
        </inline>
      </block>
      <block type="paragraph">
        <inline type="link">
          t<focus />wo
        </inline>
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
    key: '10',
    data: {},
    nodes: [
      {
        object: 'block',
        key: '3',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            key: '11',
            leaves: [
              {
                object: 'leaf',
                text: '',
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
                    text: 'one',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            object: 'text',
            key: '12',
            leaves: [
              {
                object: 'leaf',
                text: '',
                marks: [],
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        key: '7',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            key: '13',
            leaves: [
              {
                object: 'leaf',
                text: '',
                marks: [],
              },
            ],
          },
          {
            object: 'inline',
            key: '5',
            type: 'link',
            data: {},
            nodes: [
              {
                object: 'text',
                key: '4',
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
            key: '14',
            leaves: [
              {
                object: 'leaf',
                text: '',
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
      offset: 2,
    },
    focus: {
      object: 'point',
      key: '4',
      path: [1, 1, 0],
      offset: 1,
    },
    isFocused: true,
    marks: null,
  },
}
