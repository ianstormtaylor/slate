/** @jsx h */

import { h } from 'slate-core-test-helpers'

export const input = {
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

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)
