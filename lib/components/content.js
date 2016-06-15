
import React from 'react'
import TextNode from './text-node'
import TextNodeModel from '../models/text-node'
import keycode from 'keycode'

/**
 * Content.
 */

class Content extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  };

  onChange(state) {
    this.props.onChange(state)
  }

  onKeyDown(e) {
    const key = keycode(e.which)

    // COMPAT: Certain keys should never be handled by the browser's mechanism,
    // because using the native contenteditable behavior introduces quirks.
    if (key === 'escape' || key === 'return') {
      e.preventDefault()
    }

    this.props.onKeyDown(e)
  }

  render() {
    const { state } = this.props
    const { nodes, selection } = state
    const children = nodes
      .toArray()
      .map(node => this.renderNode(node))

    return (
      <div
        contentEditable
        suppressContentEditableWarning
        data-type='content'
        onKeyDown={(e) => this.onKeyDown(e)}
      >
        {children}
      </div>
    )
  }

  renderNode(node) {
    const { renderMark, renderNode } = this.props

    if (node instanceof TextNodeModel) {
      return (
        <TextNode
          key={node.key}
          node={node}
          renderMark={renderMark}
        />
      )
    }

    const Component = renderNode(node)
    const children = node.children
      .toArray()
      .map(child => this.renderNode(child))

    return (
      <Component
        {...node}
        key={node.key}
        children={children}
      />
    )
  }

}

/**
 * Export.
 */

export default Content
