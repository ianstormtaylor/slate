/** @jsx sugar */

import sugar from '../../../../helpers/sugar'

export const input = {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: 'o',
              },
              {
                text: 'n',
                marks: [
                  {
                    kind: 'mark',
                    type: 'bold'
                  }
                ]
              },
              {
                text: 'e',
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
        o<b>n</b>e
      </paragraph>
    </document>
  </state>
)
