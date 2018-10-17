/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const input = (
  <value>
    <document>
      one
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>two</paragraph>
    </document>
  </value>
)
