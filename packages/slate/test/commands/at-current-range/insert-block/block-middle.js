/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertBlock('quote')
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
      <paragraph>wo</paragraph>
      <quote>
        <cursor />
      </quote>
      <paragraph>rd</paragraph>
    </document>
  </value>
)
