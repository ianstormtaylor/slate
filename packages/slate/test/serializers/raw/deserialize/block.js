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

export const output = (
  <value>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </value>
)
