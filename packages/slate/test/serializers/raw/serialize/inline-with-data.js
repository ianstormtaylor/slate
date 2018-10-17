/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link thing="value">one</link>
        <text />
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
                text: '',
                marks: [],
              },
            ],
          },
          {
            object: 'inline',
            type: 'link',
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
