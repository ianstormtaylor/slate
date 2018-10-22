/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveForward()
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
        one t<cursor />wo three
      </paragraph>
    </document>
  </value>
)
