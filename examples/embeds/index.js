
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import Video from './video'
import initialState from './state.json'

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
          placeholder="Enter some text..."
          state={this.state.state}
          onChange={this.onChange}
          renderNode={this.renderNode}
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props) => {
    switch (props.node.type) {
      case 'video': return <Video {...props} />
    }
  }

}

/**
 * Export.
 */

export default Embeds
