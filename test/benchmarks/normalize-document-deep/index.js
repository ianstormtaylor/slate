
module.exports = {
  run(state) {
    return state.transform({ normalized: false }).normalize().apply()
  }
}
