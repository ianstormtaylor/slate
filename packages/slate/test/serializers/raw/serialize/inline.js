/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
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
                text: '',
                marks: [],
              },
            ],
          },
          {
            object: 'inline',
            type: 'link',
            isVoid: false,
            data: {},
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
