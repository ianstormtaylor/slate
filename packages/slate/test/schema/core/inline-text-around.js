/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          <link>
            one
          </link>
          <link>
            two
          </link>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = {
  kind: 'state',
  document: {
    kind: 'document',
    data: {},
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        isVoid: false,
        data: {},
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
            isVoid: false,
            data: {},
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
                isVoid: false,
                data: {},
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
              {
                kind: 'inline',
                type: 'link',
                isVoid: false,
                data: {},
                nodes: [
                  {
                    kind: 'text',
                    leaves: [
                      {
                        kind: 'leaf',
                        text: 'two',
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
