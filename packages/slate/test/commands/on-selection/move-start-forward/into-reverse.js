/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveStartForward(8)
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
        one two t<focus />hre<anchor />e
      </paragraph>
    </document>
  </value>
)
