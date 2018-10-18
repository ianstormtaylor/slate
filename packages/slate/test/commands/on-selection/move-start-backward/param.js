/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveStartBackward(3)
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
        o<anchor />ne two t<focus />hree
      </paragraph>
    </document>
  </value>
)
