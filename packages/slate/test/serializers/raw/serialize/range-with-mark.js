/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        o<b>n</b>e
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
        isVoid: false,
        data: {},
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                text: 'o',
                marks: [],
              },
              {
                kind: 'leaf',
                text: 'n',
                marks: [
                  {
                    kind: 'mark',
                    type: 'bold',
                    data: {},
                  }
                ]
              },
              {
                kind: 'leaf',
                text: 'e',
                marks: [],
              }
            ]
          }
        ]
      }
    ]
  }
}
