
import Editor from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import { Plaintext } from '../..'

/**
 * State.
 */

const state = 'A string of plain text.'

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
          console.log('State:', state.toJS())
          console.log('Content:', Plaintext.serialize(state))
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
