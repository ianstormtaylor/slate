/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveAnchorBackward(3)
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />tw<focus />o three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        o<anchor />ne tw<focus />o three
      </paragraph>
    </document>
  </value>
)
