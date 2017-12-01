/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag>
            one
          </hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = {
  kind: 'value',
  document: {
    kind: 'document',
    data: {},
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        data: {},
        isVoid: false,
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                text: '',
                marks: [],
              }
            ]
          },
          {
            kind: 'inline',
            type: 'link',
            data: {},
            isVoid: false,
            nodes: [
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
                    text: '',
                    marks: [],
                  }
                ]
              },
              {
                kind: 'inline',
                type: 'hashtag',
                data: {},
                isVoid: false,
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
                        text: 'one',
                        marks: [],
                      }
                    ]
                  }
                ]
              },
              {
                kind: 'text',
                leaves: [
                  {
                    kind: 'leaf',
                    text: '',
                    marks: [],
                  }
                ]
              },
            ]
          },
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                text: '',
                marks: [],
              }
            ]
          },
        ]
      }
    ]
  }
}
