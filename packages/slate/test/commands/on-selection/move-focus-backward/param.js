/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveFocusBackward(6)
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
        one <anchor />t<focus />wo three
      </paragraph>
    </document>
  </value>
)
