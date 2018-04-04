/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word
      </paragraph>
      <paragraph>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <cursor />
      </quote>
    </document>
  </value>
)
