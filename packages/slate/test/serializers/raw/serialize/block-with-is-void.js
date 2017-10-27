/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <image />
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
        type: 'image',
        isVoid: true,
        data: {},
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaf',
                text: ' ',
                marks: [],
              }
            ]
          }
        ]
      }
    ]
  }
}
