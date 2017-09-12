/** @jsx h */
/* eslint-disable react/jsx-key */

import h from '../../test/helpers/h'
import { State } from '../..'

export default function (json) {
  State.fromJSON(json)
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
              ranges: [
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
