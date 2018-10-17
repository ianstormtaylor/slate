/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveFocusBackward(10)
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two thr<focus />ee
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
