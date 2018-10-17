/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <cursor />two three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<cursor /> two three
      </paragraph>
    </document>
  </value>
)
