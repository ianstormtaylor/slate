/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndBackward(3)
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
        one <anchor />tw<focus />o three
      </paragraph>
    </document>
  </value>
)
