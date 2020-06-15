/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph key="a">word</paragraph>
    </document>
  </value>
)

export default function({ document }) {
  return document.getFurthestOnlyChildAncestor('a')
}

export const output = null
