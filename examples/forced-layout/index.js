
import { Editor } from 'slate-react'
import { Block, State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * A simple schema to enforce the nodes in the Slate document.
 *
 * @type {Object}
 */

const schema = {
  document: {
    nodes: [
      { types: ['title'], min: 1, max: 1 },
      { types: ['paragraph'], min: 1 },
    ],
    normalize: (change, reason, { node, child, index }) => {
      switch (reason) {
        case 'child_type_invalid': {
          return change.setNodeByKey(child.key, index == 0 ? 'title' : 'paragraph')
        }
        case 'child_required': {
          const block = Block.create(index == 0 ? 'title' : 'paragraph')
          return change.insertNodeByKey(node.key, index, block)
        }
      }
    }
  }
}

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
          schema={schema}
          onChange={this.onChange}
          renderNode={this.renderNode}
          validateNode={this.validateNode}
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
      case 'title': return <h2 {...attributes}>{children}</h2>
      case 'paragraph': return <p {...attributes}>{children}</p>
    }
  }

}

/**
 * Export.
 */

export default ForcedLayout
