/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      text: t => t === 'valid',
    },
  },
}

export const input = (
  <value>
    <document>
      <block>valid</block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>valid</block>
    </document>
  </value>
)
