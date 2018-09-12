import { Editor } from '@gitbook/slate-react'
import { Value } from '@gitbook/slate'

import React from 'react'
import initialValue from './value.json'

/**
 * A right-to-left text example.
 *
 * @type {Component}
 */

class RTL extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter some plain text..."
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
    }
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
}

/**
 * Export.
 */

export default RTL
