/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'remove_node',
    path: [0],
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
        <highlight>tw</highlight>o
      </paragraph>
    </document>
  </value>
)
