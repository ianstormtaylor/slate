/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />ord
      </paragraph>
    </document>
  </value>
)
