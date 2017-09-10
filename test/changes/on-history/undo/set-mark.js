/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .setMarkByKey('key1', 0, 8, 'mark', { type: 'newMarkType', data: { a: 1 }})

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
