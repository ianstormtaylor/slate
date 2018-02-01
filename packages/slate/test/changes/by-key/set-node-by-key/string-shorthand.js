/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setNodeByKey('a', 'quote')
}

export const input = (
  <value>
    <document>
      <paragraph key="a">word</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>word</quote>
    </document>
  </value>
)
