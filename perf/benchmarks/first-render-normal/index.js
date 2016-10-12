const { Editor } = require('../../../')
const React = require('react')
const ReactDOM = require('react-dom')

module.exports = {
  run(state) {
    const div = document.createElement('div')
    const props = { state }

    ReactDOM.render(<Editor {...props} />, div)
  }
}
