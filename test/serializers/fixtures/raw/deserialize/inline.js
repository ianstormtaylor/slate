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
        <link>
          one
        </link>
      </paragraph>
    </document>
  </state>
)
