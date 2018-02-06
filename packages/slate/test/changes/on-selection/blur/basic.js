/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.blur()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)
