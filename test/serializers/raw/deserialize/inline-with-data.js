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
        data: {},
        isVoid: false,
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                kind: 'range',
                text: '',
                marks: [],
              }
            ]
          },
          {
            kind: 'inline',
            type: 'link',
            isVoid: false,
            data: {
              thing: 'value'
            },
            nodes: [
              {
                kind: 'text',
                ranges: [
                  {
                    kind: 'range',
                    text: 'one',
                    marks: [],
                  }
                ]
              }
            ]
          },
          {
            kind: 'text',
            ranges: [
              {
                kind: 'range',
                text: '',
                marks: [],
              }
            ]
          },
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
