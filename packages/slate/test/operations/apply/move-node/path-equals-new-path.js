/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'move_node',
    path: [0],
    newPath: [0],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>2</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>2</paragraph>
    </document>
  </value>
)
