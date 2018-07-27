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
      anchorKey: '0',
      anchorPath: [0, 0],
      anchorOffset: 3,
      focusKey: '0',
      focusPath: [0, 0],
      focusOffset: 6,
      isBackward: false,
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
