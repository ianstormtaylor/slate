/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two three f<focus />our five six
      </paragraph>
    </document>
  </value>
)

// Should move to next word after focus and collapse
export const output = (
  <value>
    <document>
      <paragraph>
        one two three <cursor />four five six
      </paragraph>
    </document>
  </value>
)
