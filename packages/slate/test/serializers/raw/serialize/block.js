/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
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
      }
    ]
  }
}
