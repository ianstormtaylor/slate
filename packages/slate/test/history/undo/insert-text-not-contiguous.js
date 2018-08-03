/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  const a = value.change().insertText('t').value
  const b = a
    .change()
    .moveBackward(1)
    .insertText('w').value
  const c = b
    .change()
    .moveBackward(1)
    .insertText('o').value
  const d = c.change().undo().value
  return d
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
