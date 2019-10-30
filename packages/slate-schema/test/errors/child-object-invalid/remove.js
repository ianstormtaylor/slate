/** @jsx h */

import { h } from '../../helpers'

export const schema = {
  blocks: {
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
