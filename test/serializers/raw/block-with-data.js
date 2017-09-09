/** @jsx sugar */

import sugar from '../../helpers/sugar'

export const state = (
  <state>
    <document>
      <paragraph thing="value">
        one
      </paragraph>
    </document>
  </state>
)

export const json = {
  kind: 'state',
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
            ranges: [
              {
                kind: 'range',
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
