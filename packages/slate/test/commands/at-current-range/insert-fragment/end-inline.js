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
      <paragraph>
        <link>word</link>
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>word</link>
        fragment<cursor />
      </paragraph>
    </document>
  </value>
)
