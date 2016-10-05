
module.exports = {
  setup(state) {
    // Move selection "foo|bar"
    return state.transform().moveForward(3).apply()
  },

  run(state) {
    // console.log('run')
    return state.transform().splitBlock().apply()
  }
}
