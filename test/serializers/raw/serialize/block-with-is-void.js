/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <state>
    <document>
      <image />
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
        type: 'image',
        isVoid: true,
        data: {},
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                kind: 'range',
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
