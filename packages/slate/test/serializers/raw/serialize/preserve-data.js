/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)

export const output = {
  kind: 'state',
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
