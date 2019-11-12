/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ object: o => ['inline', 'text'].includes(o) }],
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block>text</block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <text />
      </quote>
    </document>
  </value>
)
