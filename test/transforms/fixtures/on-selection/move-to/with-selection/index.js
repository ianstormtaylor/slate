
import assert from 'assert'

export default function (state) {
  const { startText, selection } = state
  const sel = selection.merge({
    anchorKey: startText.key,
    anchorOffset: 0,
    focusKey: startText.key,
    focusOffset: startText.length,
  })

  const next = state
    .transform()
    .select(sel)
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}
