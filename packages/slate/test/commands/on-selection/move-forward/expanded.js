/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two th<focus />ree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one t<anchor />wo thr<focus />ee
      </paragraph>
    </document>
  </value>
)
