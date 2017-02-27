
import assert from 'assert'

export default function (state) {
  const { startText, selection } = state
  const props = {
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.length,
  }

  const sel = selection.merge(props)
  const next = state
    .transform()
    .select(props)
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}
