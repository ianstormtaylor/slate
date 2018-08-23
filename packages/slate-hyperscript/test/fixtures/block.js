/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <document>
    <block type="paragraph">word</block>
  </document>
)

export const output = {
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
  ],
}
