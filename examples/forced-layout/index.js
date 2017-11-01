
import { Editor } from 'slate-react'
import { Block, Value } from 'slate'

import React from 'react'
import initialValue from './value.json'

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
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
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
          value={this.state.value}
          schema={schema}
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
