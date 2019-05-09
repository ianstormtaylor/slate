/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  marks: {
    b: 'bold',
  },
  decorations: {
    highlight: 'highlight',
  },
})

export const input = (
  <value>
    <document>
      <block type="paragraph">
        This is a{' '}
        <highlight>
          paragraph <b>with</b>
        </highlight>{' '}
        a cursor position <cursor />(closed selection).
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
                text: 'This is a paragraph ',
                marks: [],
              },
              {
                object: 'leaf',
                text: 'with',
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
                text: ' a cursor position (closed selection).',
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
]
