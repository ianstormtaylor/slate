/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  decorations: {
    highlight: 'highlight',
  },
})

export const input = (
  <value>
    <document>
      <block type="paragraph">
        one<highlight>two</highlight>three
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
    key: '3',
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
                text: 'onetwothree',
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
        offset: 3,
      },
      focus: {
        object: 'point',
        key: '0',
        path: [0, 0],
        offset: 6,
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
