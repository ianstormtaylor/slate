/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteCharForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />📛<link>word</link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />
        <link>word</link>
      </paragraph>
    </document>
  </value>
)
