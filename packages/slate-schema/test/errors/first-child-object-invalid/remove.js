/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    a: {
      validate: {
        first: { properties: { type: 'a' } },
      },
    },
  },
}

export const input = (
  <value>
    <a>
      <b>word</b>
    </a>
  </value>
)

export const output = <value />
