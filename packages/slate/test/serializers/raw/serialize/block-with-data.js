/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph thing="value">
        one
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
        data: {
          thing: 'value'
        },
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                text: 'one',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  }
}
