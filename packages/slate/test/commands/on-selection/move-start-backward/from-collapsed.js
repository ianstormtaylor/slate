/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveStartBackward()
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
        one two <anchor />t<focus />hree
      </paragraph>
    </document>
  </value>
)
