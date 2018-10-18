/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two t<cursor />hree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one two t<anchor />h<focus />ree
      </paragraph>
    </document>
  </value>
)
