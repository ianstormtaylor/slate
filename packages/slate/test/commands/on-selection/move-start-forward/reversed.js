/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveStartForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <focus />two t<anchor />hree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one t<focus />wo t<anchor />hree
      </paragraph>
    </document>
  </value>
)
