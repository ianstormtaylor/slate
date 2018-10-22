/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <focus />two three fou<anchor />r five six
      </paragraph>
    </document>
  </value>
)

// Should move to next word after focus and collapse
export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />one two three four five six
      </paragraph>
    </document>
  </value>
)
