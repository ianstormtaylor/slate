/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock()
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
      <paragraph>
        <cursor />rd
      </paragraph>
    </document>
  </value>
)
