
module.exports = {
  run(state, schema) {
    return state.transform({ normalized: false }).normalize(schema).apply()
  }
}
