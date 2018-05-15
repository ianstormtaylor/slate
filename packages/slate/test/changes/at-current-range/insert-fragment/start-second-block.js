/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>fragment</quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <paragraph>
        <cursor />another
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <paragraph>
        fragment<cursor />another
      </paragraph>
    </document>
  </value>
)
