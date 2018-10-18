/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndBackward(7)
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <focus />two <anchor />three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        o<anchor />ne <focus />two three
      </paragraph>
    </document>
  </value>
)
