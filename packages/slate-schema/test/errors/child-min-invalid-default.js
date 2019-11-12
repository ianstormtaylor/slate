/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    title: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'title' }],
          min: 1,
        },
        {
          match: [{ type: 'paragraph' }],
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block>
          <text />
        </block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
