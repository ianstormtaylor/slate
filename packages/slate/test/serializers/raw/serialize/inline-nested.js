/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <text />
          <hashtag>one</hashtag>
          <text />
        </link>
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
            text: '',
            marks: [],
          },
          {
            object: 'inline',
            type: 'link',
            data: {},
            nodes: [
              {
                object: 'text',
                text: '',
                marks: [],
              },
              {
                object: 'inline',
                type: 'hashtag',
                data: {},
                nodes: [
                  {
                    object: 'text',
                    text: 'one',
                    marks: [],
                  },
                ],
              },
              {
                object: 'text',
                text: '',
                marks: [],
              },
            ],
          },
          {
            object: 'text',
            text: '',
            marks: [],
          },
        ],
      },
    ],
  },
}
