/** @jsx h */
/* eslint-disable import/no-extraneous-dependencies */
import h from 'slate-hyperscript'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one<anchor />
      </block>
      <block type="paragraph">
        two<focus />
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
        isVoid: false,
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
        isVoid: false,
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
    ],
  },
  selection: {
    object: 'range',
    anchor: {
      object: 'point',
      key: '0',
      path: [0, 0],
      offset: 3,
    },
    focus: {
      object: 'point',
      key: '2',
      path: [1, 0],
      offset: 3,
    },
    isFocused: true,
    isAtomic: false,
    marks: null,
  },
}
