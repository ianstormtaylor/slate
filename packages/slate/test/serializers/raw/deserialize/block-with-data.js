/** @jsx h */

import h from '../../../helpers/h'

export const input = {
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

export const output = (
  <value>
    <document>
      <paragraph thing="value">
        one
      </paragraph>
    </document>
  </value>
)
