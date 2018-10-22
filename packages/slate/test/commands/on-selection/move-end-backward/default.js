/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndBackward()
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
        one <anchor />two <focus />three
      </paragraph>
    </document>
  </value>
)
