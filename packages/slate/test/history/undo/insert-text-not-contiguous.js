/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .insertText('t')
    .value.change()
    .move(-1)
    .insertText('w')
    .value.change()
    .move(-1)
    .insertText('o')
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        onew<cursor />t
      </paragraph>
    </document>
  </value>
)
