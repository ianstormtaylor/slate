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
        type: 'quote',
        data: {},
        isVoid: false,
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
                    text: 'one',
                    object: 'leaf',
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

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
    </document>
  </value>
)
