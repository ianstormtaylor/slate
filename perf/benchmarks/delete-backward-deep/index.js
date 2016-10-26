
module.exports = {
  setup(state) {
    // Move cursor
    return state.transform()
      .collapseToStartOf({ key: '_cursor_' })
      .moveForward(10) // Move inside the text
      .apply()
  },

  run(state) {
    return state.transform().deleteBackward().apply()
  }
}
