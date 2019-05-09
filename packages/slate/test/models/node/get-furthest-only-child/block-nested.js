/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">word</paragraph>
      </quote>
    </document>
  </value>
)

export default function(value) {
  const { document } = value
  return document.getFurthestOnlyChildAncestor('a')
}

export const output = (
  <quote>
    <paragraph>word</paragraph>
  </quote>
)
