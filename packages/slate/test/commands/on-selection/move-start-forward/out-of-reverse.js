/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveStartForward(7)
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
        one two t<anchor />hr<focus />ee
      </paragraph>
    </document>
  </value>
)
