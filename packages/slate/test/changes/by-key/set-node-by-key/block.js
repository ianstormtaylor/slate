/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setNodeByKey('a', {
    type: 'quote',
    data: { thing: false },
  })
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
      <quote thing={false}>word</quote>
    </document>
  </value>
)
