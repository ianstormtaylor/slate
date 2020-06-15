/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  decorations: {
    highlight: 'highlight',
    lowlight: 'lowlight',
  },
})

export const input = (
  <value>
    <document>
      <block type="paragraph">
        This is a <highlight>paragraph with</highlight> two{' '}
        <lowlight>decorations</lowlight>.
      </block>
    </document>
  </value>
)

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'This is a paragraph with two decorations.',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}

export const expectDecorations = [
  {
    anchorOffset: 10,
    focusOffset: 24,
    anchorKey: input.texts.get(0).key,
    focusKey: input.texts.get(0).key,
    marks: [
      {
        object: 'mark',
        type: 'highlight',
        data: {},
      },
    ],
  },
  {
    anchorOffset: 29,
    focusOffset: 40,
    anchorKey: input.texts.get(0).key,
    focusKey: input.texts.get(0).key,
    marks: [
      {
        object: 'mark',
        type: 'lowlight',
        data: {},
      },
    ],
  },
]
