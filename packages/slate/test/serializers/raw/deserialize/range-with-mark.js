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
        type: 'paragraph',
        isVoid: false,
        data: {},
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                kind: 'leaves',
                text: 'o',
                marks: [],
              },
              {
                kind: 'leaves',
                text: 'n',
                marks: [
                  {
                    kind: 'mark',
                    type: 'bold',
                    data: {},
                  }
                ]
              },
              {
                kind: 'leaves',
                text: 'e',
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
        o<b>n</b>e
      </paragraph>
    </document>
  </state>
)
