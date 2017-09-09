/** @jsx sugar */

import sugar from '../../helpers/sugar'

export const state = (
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

export const json = {
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
