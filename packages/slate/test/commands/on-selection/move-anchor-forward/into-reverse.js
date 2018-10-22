/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveAnchorForward(8)
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
        one two th<focus />re<anchor />e
      </paragraph>
    </document>
  </value>
)
