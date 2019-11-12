/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    a: {
      validate: {
        properties: {
          key: true,
        },
      },
    },
  },
}

export const input = (
  <value>
    <a key={false}>word</a>
  </value>
)

export const output = <value />
