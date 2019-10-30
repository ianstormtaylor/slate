/** @jsx h */

import { h } from '../../helpers'

export const schema = {
  blocks: {
    a: {
      validate: {
        text: v => v === 'valid',
      },
    },
  },
}

export const input = (
  <value>
    <a>invalid</a>
  </value>
)

export const output = <value />
