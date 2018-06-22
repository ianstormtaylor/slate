/** @jsx h */
/* eslint-disable import/no-extraneous-dependencies */
import h from 'slate-hyperscript'

export const input = (
  <document>
    <block type="paragraph">Single block</block>
  </document>
)

export const output = {
  object: 'document',
  data: {},
  nodes: [
    {
      object: 'block',
      type: 'paragraph',
      isVoid: false,
      data: {},
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: 'Single block',
              marks: [],
            },
          ],
        },
      ],
    },
  ],
}
