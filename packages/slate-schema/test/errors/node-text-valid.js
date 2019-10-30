/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      text: /^\d*$/,
    },
  },
}

export const input = (
  <value>
    <document>
      <block>123</block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>123</block>
    </document>
  </value>
)
