/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveEndBackward()
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
        one two <focus />t<anchor />hree
      </paragraph>
    </document>
  </value>
)
