import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * A right-to-left text example.
 *
 * @type {Component}
 */

class RTL extends React.Component {
  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter some plain text..."
        defaultValue={initialValue}
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
