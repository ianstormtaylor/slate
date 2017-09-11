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
  document: {
    kind: 'document',
    key: '4',
    data: {},
    nodes: [
      {
        kind: 'block',
        key: '1',
        type: 'paragraph',
        data: {},
        isVoid: false,
        nodes: [
          {
            kind: 'text',
            key: '0',
            ranges: [
              {
                text: 'one',
                kind: 'range',
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
  preserveKeys: true,
}
