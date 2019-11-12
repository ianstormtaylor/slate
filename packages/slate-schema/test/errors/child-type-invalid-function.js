/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: t => t === 'paragraph' }],
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block void>
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
