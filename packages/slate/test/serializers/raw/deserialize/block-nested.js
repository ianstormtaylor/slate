/** @jsx h */

import h from '../../../helpers/h'

export const input = {
  kind: 'state',
  document: {
    kind: 'document',
    data: {},
    nodes: [
      {
        kind: 'block',
        type: 'quote',
        data: {},
        isVoid: false,
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
    ]
  }
}

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
      </quote>
    </document>
  </state>
)
