/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveStartForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two t<focus />hree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one t<anchor />wo t<focus />hree
      </paragraph>
    </document>
  </value>
)
