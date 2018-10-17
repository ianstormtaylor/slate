/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveAnchorBackward(8)
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
        on<anchor />e <focus />two three
      </paragraph>
    </document>
  </value>
)
