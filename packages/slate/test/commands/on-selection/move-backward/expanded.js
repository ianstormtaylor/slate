/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveBackward()
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
        one<anchor /> two t<focus />hree
      </paragraph>
    </document>
  </value>
)
