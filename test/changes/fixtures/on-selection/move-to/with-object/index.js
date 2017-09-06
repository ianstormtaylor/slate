
import assert from 'assert'

export default function (state) {
  const { startText, selection } = state
  const props = {
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  }

  const sel = selection.merge(props)
  const next = state
    .change()
    .select(props)
    .state

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}
