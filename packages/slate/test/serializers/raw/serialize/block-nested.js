/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
      </quote>
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
    ]
  }
}
