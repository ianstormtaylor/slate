/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <inline type="test">one</inline>
        <text key="a">two</text>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const { document } = value
  return document.getFurthestOnlyChildAncestor('a')
}

export const output = null
