/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  elements: {
    a: {
      validate: {
        children: [{ min: 2 }],
      },
    },
  },
}

export const input = (
  <value>
    <a>
      <b>one</b>
    </a>
  </value>
)

export const output = <value />
