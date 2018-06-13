/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setValue({ data: { thing: 'value' } })
}

export const input = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </value>
)

export const output = (
  <value data={{ thing: 'value' }}>
    <document>
      <paragraph>word</paragraph>
      <paragraph>another</paragraph>
    </document>
  </value>
)
