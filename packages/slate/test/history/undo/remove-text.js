/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .moveAnchorForward(4)
    .moveFocusForward(7)
    .delete()
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one <anchor />two<focus /></paragraph>
    </document>
  </value>
)
