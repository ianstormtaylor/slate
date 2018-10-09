/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteWordForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one two three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor /> two three
      </paragraph>
    </document>
  </value>
)
