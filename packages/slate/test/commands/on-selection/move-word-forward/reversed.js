/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveWordForward()
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
        one two<cursor /> three four five six
      </paragraph>
    </document>
  </value>
)
