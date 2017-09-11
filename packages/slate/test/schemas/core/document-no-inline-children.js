/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <state>
    <document>
      <link>
        one
      </link>
      <paragraph>
        two
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
            ranges: [
              {
                kind: 'range',
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
