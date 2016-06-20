
import Editor from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import { Plaintext } from '../..'

/**
 * State.
 */

const state = 'This is editable plain text, just like a <textarea>!'

/**
 * App.
 */

class App extends React.Component {

  state = {
    state: Plaintext.deserialize(state)
  };

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={(state) => {
          console.groupCollapsed('Change!')
          console.log('Document:', state.document.toJS())
          console.log('Selection:', state.selection.toJS())
          console.log('Content:', Plaintext.serialize(state))
          console.groupEnd()
          this.setState({ state })
        }}
      />
    )
  }

}

/**
 * Attach.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
