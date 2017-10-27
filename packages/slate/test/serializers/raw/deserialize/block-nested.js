/** @jsx h */

import h from '../../../helpers/h'

export const input = {
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

export const output = (
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
