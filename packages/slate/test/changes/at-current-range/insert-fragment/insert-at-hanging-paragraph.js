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
        <cursor />word
      </paragraph>
      <paragraph>
        <focus />is a word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />fragmentis a word
      </paragraph>
    </document>
  </value>
)
