/** @jsx h */

import { h } from '../../helpers'

export const schema = {
  blocks: {
    a: {
      validate: {
        children: [
          {
            match: {
              properties: {
                key: v => v == null,
              },
            },
          },
        ],
      },
    },
  },
}

export const input = (
  <value>
    <a>
      <b key={false}>word</b>
    </a>
  </value>
)

export const output = (
  <value>
    <a>
      <b key={null}>word</b>
    </a>
  </value>
)
