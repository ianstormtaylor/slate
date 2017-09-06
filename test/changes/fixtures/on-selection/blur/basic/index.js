
import assert from 'assert'

export default function (state) {
  const { startText, selection } = state

  const next = state
    .change()
    .focus()
    .blur()
    .state

  assert.deepEqual(
    next.selection.toJS(),
    selection.toJS()
  )
}
