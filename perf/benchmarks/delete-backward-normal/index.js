
module.exports = {
  setup(state) {
    // Move cursor
    return state.transform()
      .moveTo({
        anchorKey: '_cursor_',
        anchorOffset: 10,
        focusKey: '_cursor_',
        focusOffset: 10
      })
      .apply()
  },

  run(state) {
    return state.transform().deleteBackward().apply()
  }
}
