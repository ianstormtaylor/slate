/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteLineForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two three
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = input
