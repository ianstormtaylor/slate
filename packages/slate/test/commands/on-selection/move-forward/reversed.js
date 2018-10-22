/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <focus />two th<anchor />ree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one t<focus />wo thr<anchor />ee
      </paragraph>
    </document>
  </value>
)
