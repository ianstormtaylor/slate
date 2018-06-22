/* eslint-disable react/jsx-key */

import { Value } from 'slate'

export default function(json) {
  Value.fromJSON(json)
}

export const input = {
  document: {
    nodes: Array.from(Array(10)).map(() => ({
      object: 'block',
      type: 'quote',
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  text: 'This is editable ',
                },
                {
                  text: 'rich',
                  marks: [{ type: 'bold' }],
                },
                {
                  text: ' text, ',
                },
                {
                  text: 'much',
                  marks: [{ type: 'italic' }],
                },
                {
                  text: ' better than a textarea!',
                },
              ],
            },
          ],
        },
      ],
    })),
  },
}
