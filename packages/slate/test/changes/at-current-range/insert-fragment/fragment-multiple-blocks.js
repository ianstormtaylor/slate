/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>one</quote>
      <quote>two</quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<cursor />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>woone</paragraph>
      <quote>
        two<cursor />rd
      </quote>
    </document>
  </value>
)
