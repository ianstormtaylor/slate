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
  data: {},
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
                text: 'one',
                kind: 'leaf',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  }
}

export const options = {
  preserveData: true,
}
