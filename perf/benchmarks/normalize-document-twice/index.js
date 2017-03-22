
module.exports = {
  run(state, schema) {
    const selection = state.selection.merge({
      anchorKey: '_cursor_',
      anchorOffset: 0,
      focusKey: '_cursor_',
      focusOffset: 0
    })

    return state
      .transform({ normalized: false }).normalize(schema).apply()
      .transform()
      // Make a fast, dummy change
      .moveTo(selection).insertText('inserted text')
      // We want to compare the speed of that second normalize (optimized through memoization, or other means)
      .normalize(schema).apply()
  }
}
