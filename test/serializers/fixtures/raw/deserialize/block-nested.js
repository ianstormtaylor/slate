/** @jsx sugar */

import sugar from '../../../../helpers/sugar'

export const input = {
  kind: 'state',
  document: {
    kind: 'document',
    nodes: [
      {
        kind: 'block',
        type: 'quote',
        nodes: [
          {
            kind: 'block',
            type: 'paragraph',
            nodes: [
              {
                ranges: [
                  {
                    text: 'one',
                    kind: 'range',
                    marks: []
                  }
                ],
                kind: 'text'
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
