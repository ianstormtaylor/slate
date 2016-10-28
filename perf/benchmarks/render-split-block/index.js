const { Editor } = require('../../../')
const React = require('react')
const ReactDOM = require('react-dom')

// Benchmarks a first rendering, followed by a new rendering after a split-block
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
    const div = document.createElement('div')

    ReactDOM.render(<Editor state={state} />, div)

    state = state.transform().splitBlock().apply()

    ReactDOM.render(<Editor state={state} />, div)
  }
}
