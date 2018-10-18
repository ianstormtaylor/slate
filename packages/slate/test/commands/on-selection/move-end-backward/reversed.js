/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndBackward()
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
        one <focus />two <anchor />three
      </paragraph>
    </document>
  </value>
)
