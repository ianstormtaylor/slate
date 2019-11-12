/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      type: t => t === 'impossible',
    },
  },
}

export const input = (
  <value>
    <document>
      <block>invalid</block>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
