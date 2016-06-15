
import React from 'react'
import ReactDOM from 'react-dom'
import TextNode from './text-node'
import TextNodeModel from '../models/text-node'
import findSelection from '../utils/find-selection'
import keycode from 'keycode'

/**
 * Content.
 */

class Content extends React.Component {

  /**
   * Props.
   */

  static propTypes = {
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  };

  /**
   * On change, bubble up.
   *
   * @param {State} state
   */

  onChange(state) {
    this.props.onChange(state)
  }

  /**
   * On key down, bubble up.
   *
   * @param {Event} e
   */

  onKeyDown(e) {
    // COMPAT: Certain keys should never be handled by the browser's mechanism,
    // because using the native contenteditable behavior introduces quirks.
    const key = keycode(e.which)
    if (key === 'escape' || key === 'return') e.preventDefault()

    this.props.onKeyDown(e)
  }

  /**
   * On select, update the current state's selection.
   *
   * @param {Event} e
   */

  onSelect(e) {
    let { state } = this.props
    let { selection } = state
    const native = window.getSelection()

    // no selection is active, so unset `hasFocus`
    if (!native.rangeCount && selection.hasFocus) {
      selection = selection.set('hasFocus', false)
      state = state.set('selection', selection)
      this.onChange(state)
      return
    }

    const el = ReactDOM.findDOMNode(this)
    const { anchorNode, anchorOffset, focusNode, focusOffset } = native
    const anchorIsText = anchorNode.nodeType == 3
    const focusIsText = focusNode.nodeType == 3

    // if both text nodes, find their parent's and create the selection
    if (anchorIsText && focusIsText) {
      const anchor = findSelection(anchorNode, anchorOffset)
      const focus = findSelection(focusNode, focusOffset)
      selection = selection.set('anchorKey', anchor.key)
      selection = selection.set('anchorOffset', anchor.offset)
      selection = selection.set('focusKey', focus.key)
      selection = selection.set('focusOffset', focus.offset)
      selection = selection.set('hasFocus', true)
      state = state.set('selection', selection)
      this.onChange(state)
      return
    }
  }

  /**
   * Render the editor content.
   *
   * @return {Component} component
   */

  render() {
    const { state } = this.props
    const { nodes } = state
    const children = nodes
      .toArray()
      .map(node => this.renderNode(node))

    return (
      <div
        contentEditable
        suppressContentEditableWarning
        data-type='content'
        onKeyDown={(e) => this.onKeyDown(e)}
        onSelect={(e) => this.onSelect(e)}
      >
        {children}
      </div>
    )
  }

  /**
   * Render a single `node`.
   *
   * @param {Node} node
   * @return {Component} component
   */

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

