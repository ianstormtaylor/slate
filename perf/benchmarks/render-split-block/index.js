const { Editor } = require('../../../')
const React = require('react')
const ReactDOM = require('react-dom')

// Benchmarks a first rendering, followed by a new rendering after a split-block
module.exports = {
  setup(state) {
    // Move cursor
    return state.transform()
      .collapseToStartOf({ key: '_cursor_' })
      .moveForward(10) // Move inside the text
      .apply()
  },

  run(state) {
    const div = document.createElement('div')

    ReactDOM.render(<Editor state={state} />, div)

    state = state.transform().splitBlock().apply()

    ReactDOM.render(<Editor state={state} />, div)
  }
}
