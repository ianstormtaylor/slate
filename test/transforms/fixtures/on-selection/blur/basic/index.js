
import assert from 'assert'

export default function (state) {
  const { startText, selection } = state

  const next = state
    .transform()
    .focus()
    .blur()
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    selection.toJS()
  )
}
