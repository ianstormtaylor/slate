/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
      <image />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </value>
)
