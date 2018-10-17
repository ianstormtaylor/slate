/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveAnchorForward(3)
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
        one two<anchor /> thr<focus />ee
      </paragraph>
    </document>
  </value>
)
