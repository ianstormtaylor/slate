/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v === 'value',
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
