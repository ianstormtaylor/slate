/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeNodeByKey('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">
          <cursor />one
        </text>
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
      <paragraph>
        <cursor />two
      </paragraph>
    </document>
  </value>
)
