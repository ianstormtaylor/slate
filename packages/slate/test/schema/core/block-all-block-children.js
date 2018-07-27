/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <link>two</link>
      </quote>
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
        type: 'quote',
        isVoid: false,
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
                    text: 'one',
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
