
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * The Forced Layout example.
 *
 * @type {Component}
 */

class ForcedLayout extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState),
    schema: {
      document: {
        defaults: {
          nodes: [
            { kind: 'block', type: 'title' },
            { kind: 'block', type: 'paragraph' },
          ]
        },
        nodes: [
          { type: 'title', min: 1, max: 1 },
          { type: 'paragraph', min: 1 },
        ]
      }
    }
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
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter a title..."
          state={this.state.state}
          schema={this.state.schema}
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
      case 'title': return <h2 {...props.attributes}>{props.children}</h2>
      case 'paragraph': return <p {...props.attributes}>{props.children}</p>
    }
  }

}

/**
 * Export.
 */

export default ForcedLayout
