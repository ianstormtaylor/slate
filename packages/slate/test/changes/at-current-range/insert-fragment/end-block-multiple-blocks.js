/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>one</quote>
      <quote>two</quote>
      <quote>three</quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wordone</paragraph>
      <quote>two</quote>
      <quote>
        three<cursor />
      </quote>
    </document>
  </value>
)
