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
  // also merge the resulting leaves
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
        The decoration begins<highlight key="1" /> in this paragraph
      </paragraph>
      <paragraph>
        And ends in this soon-to-be merged<highlight key="1" /> one.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        The decoration begins<highlight key="1" /> in this paragraphAnd ends in
        this soon-to-be merged<highlight key="1" /> one.
      </paragraph>
    </document>
  </value>
)
