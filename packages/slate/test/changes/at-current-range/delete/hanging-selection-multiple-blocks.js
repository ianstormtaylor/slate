/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <paragraph>two</paragraph>
      <quote>
        <focus />three
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <cursor />three
      </quote>
    </document>
  </value>
)
