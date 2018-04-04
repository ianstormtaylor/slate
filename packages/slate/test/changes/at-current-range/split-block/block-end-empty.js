/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitBlock()
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
      <paragraph></paragraph>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)
