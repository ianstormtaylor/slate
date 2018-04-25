/** @jsx h */

import { createHyperscript } from '../..'

const h = createHyperscript({
  blocks: {
    ul: 'ul',
    li: 'li',
  },
  decorators: {
    highlight: 'highlight',
  },
})

export const input = (
  <value>
    <document>
      <ul>
        <li>
          Item <highlight key="a" />one.
        </li>
        <li>
          Item<highlight key="a" /> two.
        </li>
      </ul>
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
        type: 'ul',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'li',
            isVoid: false,
            data: {},
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: 'Item one.',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            object: 'block',
            type: 'li',
            isVoid: false,
            data: {},
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: 'Item two.',
                    marks: [],
                  },
                ],
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
    anchorOffset: 5,
    focusOffset: 4,
    anchorKey: input.document
      .filterDescendants(n => n.type === 'li')
      .get(0)
      .getFirstText().key,
    focusKey: input.document
      .filterDescendants(n => n.type === 'li')
      .get(1)
      .getFirstText().key,
    marks: [
      {
        object: 'mark',
        type: 'highlight',
        data: {},
      },
    ],
  },
]
