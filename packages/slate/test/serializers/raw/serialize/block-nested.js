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
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'quote',
        data: {},
        isVoid: false,
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            data: {},
            isVoid: false,
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'one',
                    object: 'leaf',
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
