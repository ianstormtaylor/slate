/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection } = state

  const t1 = state
    .change()
    .moveNodeByKey('d', 'a', 0)

  const s1 = t1

  const t2 = s1
    .change()
    .undo()

  const next = t2
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>The</paragraph>
      </quote>
      <paragraph>text</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>The</paragraph>
      </quote>
      <paragraph>text</paragraph>
    </document>
  </state>
)
