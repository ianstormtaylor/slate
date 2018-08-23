/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteWordForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
        <link>wo📛rd</link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />
        <link />
      </paragraph>
    </document>
  </value>
)
