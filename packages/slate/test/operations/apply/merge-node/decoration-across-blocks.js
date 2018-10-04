/** @jsx h */

import h from '../../../helpers/h'

export default [
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
    position: 1,
    properties: {},
    target: null,
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        o<highlight key="a" />ne
      </paragraph>
      <paragraph>
        tw<highlight key="a" />o
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        o<highlight>netw</highlight>o
      </paragraph>
    </document>
  </value>
)
