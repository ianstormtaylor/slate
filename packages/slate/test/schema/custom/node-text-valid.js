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
      <paragraph>123</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>123</paragraph>
    </document>
  </value>
)
