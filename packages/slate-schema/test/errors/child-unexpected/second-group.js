/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  elements: {
    a: {
      validate: {
        children: [{ max: 1 }, { max: 1 }],
      },
    },
  },
}

export const input = (
  <value>
    <a>
      <b>one</b>
      <b>two</b>
      <b>three</b>
    </a>
  </value>
)

export const output = (
  <value>
    <a>
      <b>one</b>
      <b>two</b>
    </a>
  </value>
)
