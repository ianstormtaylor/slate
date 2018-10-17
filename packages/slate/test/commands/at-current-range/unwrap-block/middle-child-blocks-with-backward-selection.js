/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
        <paragraph>
          <focus />three
        </paragraph>
        <paragraph>
          <anchor />four
        </paragraph>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
      <paragraph>
        <focus />three
      </paragraph>
      <paragraph>
        <anchor />four
      </paragraph>
      <quote>
        <paragraph>five</paragraph>
        <paragraph>six</paragraph>
      </quote>
    </document>
  </value>
)
