/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>
        <quote>one</quote>
        <quote>two</quote>
      </quote>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          wo<cursor />rd
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>wo</paragraph>
        <quote>
          <quote>one</quote>
          <quote>two</quote>
        </quote>
        <paragraph>
          rd<cursor />
        </paragraph>
      </quote>
    </document>
  </value>
)
