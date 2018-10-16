/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteLineBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two thr<cursor />ee
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />ee
      </paragraph>
    </document>
  </value>
)
