/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteForward(3)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />d
      </paragraph>
    </document>
  </value>
)
