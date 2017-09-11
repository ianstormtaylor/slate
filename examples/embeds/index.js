
import { Editor, State } from '../..'
import React from 'react'
import Video from './video'
import initialState from './state.json'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    video: Video
  }
}

/**
 * The images example.
 *
 * @type {Component}
 */

class Embeds extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState)
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render() {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default Embeds
