/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  change
    .addMarkByKey('a', 0, 8, 'marktype')

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <paragraph>te
        <b>xt</b>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>te
        <b>xt</b>
      </paragraph>
    </document>
  </state>
)
