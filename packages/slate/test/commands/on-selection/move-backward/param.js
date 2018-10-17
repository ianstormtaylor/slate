/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveBackward(6)
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two th<cursor />ree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one <cursor />two three
      </paragraph>
    </document>
  </value>
)
