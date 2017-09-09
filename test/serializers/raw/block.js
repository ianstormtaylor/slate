/** @jsx sugar */

import sugar from '../../helpers/sugar'

export const state = (
  <state>
    <document>
      <paragraph>
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
        data: {},
        isVoid: false,
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                kind: 'range',
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
