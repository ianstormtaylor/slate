/** @jsx h */

import h from '../../src'

export const input = (
  <value>
    <document>
      <block type="paragraph">
        A string of <mark type="bold">bold</mark> in a{' '}
        <inline type="link" data={{ src: 'http://slatejs.org' }}>
          Slate
        </inline>{' '}
        editor!
      </block>
      <block type="image" data={{ src: 'https://...' }} isVoid />
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
