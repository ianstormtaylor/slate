/** @jsx h */

import { createHyperscript } from '../..'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  marks: {
    b: 'bold',
  },
})

export const input = (
  <value>
    <document>
      <paragraph>First paragraph</paragraph>
      <paragraph>
        This is a paragraph with a cursor{' '}
        <b>
          positi<cursor />on
        </b>{' '}
        within a mark.
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
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'First paragraph',
                marks: [],
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'This is a paragraph with a cursor ',
                marks: [],
              },
              {
                object: 'leaf',
                text: 'position',
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
                text: ' within a mark.',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}

export const expectSelection = {
  isCollapsed: true,
  anchorOffset: 40,
  focusOffset: 40,
  anchorKey: input.texts.get(0).key,
  focusKey: input.texts.get(0).key,
}
