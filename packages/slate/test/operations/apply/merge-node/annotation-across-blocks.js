/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      o<annotation key="a" />ne
    </block>
    <block>
      tw<annotation key="a" />o
    </block>
  </value>
)

export const operations = [
  {
    type: 'merge_node',
    path: [1],
    position: 1,
    properties: {},
    target: null,
  },
  {
    type: 'merge_node',
    path: [0, 1],
    position: 3,
    properties: {},
    target: null,
  },
]

export const output = (
  <value>
    <block>
      o<annotation key="a">netw</annotation>o
    </block>
  </value>
)
