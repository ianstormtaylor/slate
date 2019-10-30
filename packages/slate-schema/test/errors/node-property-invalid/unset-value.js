/** @jsx h */

import { h } from '../../helpers'

export const schema = {
  blocks: {
    a: {
      validate: {
        properties: {
          key: null,
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

export const output = (
  <value>
    <a key={null}>word</a>
  </value>
)
