/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragmentByKey(
    'a',
    1,
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document key="a">
      <paragraph>word</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
