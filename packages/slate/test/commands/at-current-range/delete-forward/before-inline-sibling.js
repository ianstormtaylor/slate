/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<link>two</link>
        <cursor />a
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<link>two</link>
        <cursor />
      </paragraph>
    </document>
  </value>
)
