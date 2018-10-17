/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveFocusForward(7)
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
        one two <anchor />thr<focus />ee
      </paragraph>
    </document>
  </value>
)
