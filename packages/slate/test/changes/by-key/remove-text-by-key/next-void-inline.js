/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
        <text key="a">a</text>
        <emoji />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>one</link>
        <emoji />
      </paragraph>
    </document>
  </value>
)
