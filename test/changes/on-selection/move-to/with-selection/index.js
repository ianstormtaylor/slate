
import assert from 'assert'

export default function (state) {
  const { startText, selection } = state
  const sel = selection.merge({
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.text.length,
  })

  const next = state
    .change()
    .select(sel)
    .state

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}
