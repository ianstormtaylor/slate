/** @jsx h */

import h from '../../../helpers/h'

export const input = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        isVoid: false,
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
          {
            object: 'inline',
            type: 'link',
            isVoid: false,
            data: {
              thing: 'value',
            },
            nodes: [
              {
                object: 'text',
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

export const output = (
  <value>
    <document>
      <paragraph>
        <link thing="value">one</link>
      </paragraph>
    </document>
  </value>
)
