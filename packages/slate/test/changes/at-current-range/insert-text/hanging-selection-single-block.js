/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>Zero</paragraph>
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
      <paragraph>Zero</paragraph>
      <paragraph>
        a<cursor />
      </paragraph>
      <quote>
        <focus />two
      </quote>
    </document>
  </value>
)
