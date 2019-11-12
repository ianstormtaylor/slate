/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ object: 'text' }],
        },
      ],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <inline>text</inline>
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
