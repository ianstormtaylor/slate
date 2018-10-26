import { Editor } from 'slate-react'
import { Value } from 'slate'

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

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      default:
        return next()
    }
  }

  /**
   * On change.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, if it's <shift-enter> add a soft break.
   *
   * @param {Event} event
   * @param {Editor} editor
   */

  onKeyDown = (event, editor, next) => {
    if (event.key == 'Enter' && event.shiftKey) {
      event.preventDefault()
      editor.insertText('\n')
      return
    }

    next()
  }
}

/**
 * Export.
 */

export default RTL
