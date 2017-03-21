
import SCHEMA from '../../../lib/constants/schema'

export default function (state) {
  const selection = state.selection.merge({
    anchorKey: '_cursor_',
    anchorOffset: 0,
    focusKey: '_cursor_',
    focusOffset: 0
  })

  state
    .transform({ normalized: false })
    .normalize(SCHEMA)
    .apply()
    .transform()
    // Make a fast, dummy change
    .select(selection)
    .insertText('inserted text')
    // We want to compare the speed of that second normalize (optimized through memoization, or other means)
    .normalize(SCHEMA)
    .apply()
}
