/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .removeMarkByKey('key1', 0, 8, 'mark')

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <paragraph>
        <m>The text</m>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <m>The text</m>
      </paragraph>
    </document>
  </state>
)
