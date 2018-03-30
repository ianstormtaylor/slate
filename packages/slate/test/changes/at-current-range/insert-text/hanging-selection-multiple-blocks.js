/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>zero</paragraph>
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
      <paragraph>zero</paragraph>
      <paragraph>
        a<cursor />three
      </paragraph>
    </document>
  </value>
)
