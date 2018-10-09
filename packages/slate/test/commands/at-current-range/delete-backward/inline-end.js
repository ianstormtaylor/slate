/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<link>two</link>
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<link>tw</link>
        <cursor />
      </paragraph>
    </document>
  </value>
)
