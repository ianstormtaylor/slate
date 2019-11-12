/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  elements: {
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
