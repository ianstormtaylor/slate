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
      <quote>
        <focus />two
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <cursor />two
      </quote>
    </document>
  </value>
)
