/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      w<cursor />
      <annotation key="a">or</annotation>d
    </block>
  </value>
)

export const operations = [
  {
    type: 'insert_text',
    path: [0, 0],
    offset: 1,
    text: 'x',
  },
]

export const output = (
  <value>
    <block>
      wx<cursor />
      <annotation key="a">or</annotation>d
    </block>
  </value>
)
