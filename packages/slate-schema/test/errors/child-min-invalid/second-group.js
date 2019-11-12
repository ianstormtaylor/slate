/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  elements: {
    a: {
      validate: {
        children: [{ max: 1 }, { min: 1 }],
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
