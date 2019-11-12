/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          max: 1,
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block>one</block>
        <block type="title">two</block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <block>one</block>
      </quote>
    </document>
  </value>
)
