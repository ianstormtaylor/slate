/** @jsx sugar */

import sugar from '../../../helpers/sugar'

export const input = (
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

export const output = {
  kind: 'state',
  document: {
    kind: 'document',
    key: '3',
    data: {},
    nodes: [
      {
        kind: 'block',
        key: '2',
        type: 'quote',
        data: {},
        isVoid: false,
        nodes: [
          {
            kind: 'block',
            key: '1',
            type: 'paragraph',
            data: {},
            isVoid: false,
            nodes: [
              {
                kind: 'text',
                key: '0',
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

export const options = {
  preserveKeys: true,
}
