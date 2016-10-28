
module.exports = {
  run(state) {
    return state.transform().normalize().apply()
  }
}
