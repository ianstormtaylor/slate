/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      one
      <paragraph>
        two
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
                text: 'two',
                marks: [],
              }
            ]
          }
        ]
      }
    ]
  }
}
