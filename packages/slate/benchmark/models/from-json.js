/* eslint-disable react/jsx-key */

import { Value } from '../..'

export default function (json) {
  Value.fromJSON(json)
}

export const input = {
  document: {
    nodes: Array.from(Array(10)).map(() => ({
      kind: 'block',
      type: 'quote',
      nodes: [
        {
          kind: 'block',
          type: 'paragraph',
          nodes: [
            {
              kind: 'text',
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
                }
              ]
            }
          ]
        }
      ]
    }))
  }
}
