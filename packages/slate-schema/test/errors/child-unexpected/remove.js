/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  elements: {
    a: {
      validate: {
        children: [{ match: {}, max: 1 }],
      },
    },
  },
}

export const input = (
  <value>
    <a>
      <b>one</b>
      <b>two</b>
    </a>
  </value>
)

export const output = (
  <value>
    <a>
      <b>one</b>
    </a>
  </value>
)
