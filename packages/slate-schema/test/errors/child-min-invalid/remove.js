/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
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
