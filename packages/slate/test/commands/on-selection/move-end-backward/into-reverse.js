/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndBackward(6)
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two<focus /> three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        o<focus />ne <anchor />two three
      </paragraph>
    </document>
  </value>
)
