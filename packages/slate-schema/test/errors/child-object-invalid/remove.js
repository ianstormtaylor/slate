/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  elements: {
    a: {
      validate: {
        children: [{ match: { object: 'text' } }],
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

export const output = (
  <value>
    <a>
      <text />
    </a>
  </value>
)
