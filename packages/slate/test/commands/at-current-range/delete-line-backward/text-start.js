/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteLineBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
        one two three
      </paragraph>
    </document>
  </value>
)

export const output = input
