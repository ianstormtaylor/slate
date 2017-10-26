
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * The plain text example.
 *
 * @type {Component}
 */

class RTL extends React.Component {

  /**
   * Deserialize the initial editor state.
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
   * On key down, if it's <shift-enter> add a soft break.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onKeyDown = (event, change) => {
    if (event.key == 'Enter' && event.shiftKey) {
      event.preventDefault()
      change.insertText('\n')
      return true
    }
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some plain text..."
          state={this.state.state}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
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
    const { attributes, children, node } = props
    switch (node.type) {
      case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>
    }
  }

}

/**
 * Export.
 */

export default RTL
