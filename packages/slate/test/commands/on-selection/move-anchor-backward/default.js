/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveAnchorBackward()
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
        one<anchor /> tw<focus />o three
      </paragraph>
    </document>
  </value>
)
