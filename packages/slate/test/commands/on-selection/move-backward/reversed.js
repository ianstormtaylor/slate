/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveBackward()
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
        one<focus /> two t<anchor />hree
      </paragraph>
    </document>
  </value>
)
