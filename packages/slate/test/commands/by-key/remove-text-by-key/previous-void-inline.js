/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeTextByKey('a', 0, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji />
        <text key="a">a</text>
        <link>two</link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji />
        <text />
        <link>two</link>
        <text />
      </paragraph>
    </document>
  </value>
)
