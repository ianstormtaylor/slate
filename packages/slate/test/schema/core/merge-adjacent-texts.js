/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">one</text>
        <text key="b">two</text>
        <text key="c">three</text>
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
                text: 'onetwothree',
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}
