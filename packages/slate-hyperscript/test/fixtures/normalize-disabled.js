/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value normalize={false}>
    <document>
      <block type="paragraph">word</block>
      <text>invalid</text>
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
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'word',
                marks: [],
              },
            ],
          },
        ],
      },
      {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: 'invalid',
            marks: [],
          },
        ],
      },
    ],
  },
}
