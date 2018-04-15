/** @jsx h */

import { createHyperscript } from '../..'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
    image: {
      type: 'image',
      isVoid: true,
    },
  },
  inlines: {
    link: 'link',
  },
  marks: {
    b: 'bold',
  },
})

export const input = (
  <value>
    <document>
      <paragraph>
        A string of <b>bold</b> in a <link src="http://slatejs.org">Slate</link>{' '}
        editor!
      </paragraph>
      <image src="https://..." />
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
                text: 'A string of ',
                marks: [],
              },
              {
                object: 'leaf',
                text: 'bold',
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
                text: ' in a ',
                marks: [],
              },
            ],
          },
          {
            object: 'inline',
            type: 'link',
            isVoid: false,
            data: {
              src: 'http://slatejs.org',
            },
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: 'Slate',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: ' editor!',
                marks: [],
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        type: 'image',
        isVoid: true,
        data: {
          src: 'https://...',
        },
        nodes: [
          {
            object: 'text',
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
}
