/** @jsx h */

import { createHyperscript } from '../..'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  decorators: {
    highlight: 'highlight',
  },
})

export const input = (
  <value>
    <document>
      <block type="paragraph">
        o<highlight key="a" />ne
      </block>
      <block type="paragraph">
        tw<highlight key="a" />o
      </block>
    </document>
  </value>
)

export const options = {
  preserveDecorations: true,
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
  decorations: [
    {
      object: 'range',
      anchor: {
        object: 'point',
        key: '0',
        path: [0, 0],
        offset: 1,
      },
      focus: {
        object: 'point',
        key: '2',
        path: [1, 0],
        offset: 2,
      },
      isFocused: false,
      isAtomic: false,
      marks: [
        {
          object: 'mark',
          type: 'highlight',
          data: {},
        },
      ],
    },
  ],
}
