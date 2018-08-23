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
      <paragraph>
        <highlight key="a" />This is one <highlight key="b" />block.
      </paragraph>
      <paragraph>
        <highlight key="a" />This is block<highlight key="b" /> two.
      </paragraph>
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
                text: 'This is one block.',
                marks: [],
              },
            ],
          },
        ],
      },
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
                text: 'This is block two.',
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
    anchorOffset: 0,
    focusOffset: 0,
    anchorKey: input.document.nodes.get(0).getFirstText().key,
    focusKey: input.document.nodes.get(1).getFirstText().key,
    marks: [
      {
        object: 'mark',
        type: 'highlight',
        data: {},
      },
    ],
  },
  {
    anchorOffset: 12,
    focusOffset: 13,
    anchorKey: input.document.nodes.get(0).getFirstText().key,
    focusKey: input.document.nodes.get(1).getFirstText().key,
    marks: [
      {
        object: 'mark',
        type: 'highlight',
        data: {},
      },
    ],
  },
]
