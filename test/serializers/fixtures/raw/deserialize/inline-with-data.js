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
            kind: 'inline',
            type: 'link',
            data: {
              thing: 'value'
            },
            nodes: [
              {
                kind: 'text',
                ranges: [
                  {
                    text: 'one',
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
      <paragraph>
        <link thing="value">
          one
        </link>
      </paragraph>
    </document>
  </state>
)
