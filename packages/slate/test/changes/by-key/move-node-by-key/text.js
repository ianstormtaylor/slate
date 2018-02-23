/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveNodeByKey('a', 'b', 1)
}

export const input = (
  <value>
    <document>
      <paragraph key="b">one</paragraph>
      <paragraph>
        <text key="a">two</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>onetwo</paragraph>
      <paragraph />
    </document>
  </value>
)
