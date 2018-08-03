/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        one<link>
          <text key="a">two</text>
        </link>three
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const { document } = value
  return document.getFurthestOnlyChildAncestor('a')
}

export const output = <link>two</link>
