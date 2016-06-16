
import React from 'react'
import ReactDOM from 'react-dom'
import Text from './text'
import TextModel from '../models/text'
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
   * Before the component updates.
   */

  componentWillUpdate() {
    this.updating = true
  }

  /**
   * After the component updates.
   */

  componentDidUpdate() {
    requestAnimationFrame(() => {
      this.updating = false
    })
  }

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
    // don't handle the selection if we're rendering, since it is about to be
    // set by the
    if (this.updating) return

    let { state } = this.props
    let { selection } = state
    const native = window.getSelection()

    // No selection is active, so unset `hasFocus`.
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

    // If both are text nodes, find their parents and create the selection.
    if (anchorIsText && focusIsText) {
      const anchor = findSelection(anchorNode, anchorOffset)
      const focus = findSelection(focusNode, focusOffset)
      const { nodes } = state

      const startAndEnd = state.filterNodes((node) => {
        return node.key == anchor.key || node.key == focus.key
      })

      const isBackward = (
        (startAndEnd.size == 2 && startAndEnd.first().key == focus.key) ||
        (startAndEnd.size == 1 && anchor.offset > focus.offset)
      )

      selection = selection.set('anchorKey', anchor.key)
      selection = selection.set('anchorOffset', anchor.offset)
      selection = selection.set('focusKey', focus.key)
      selection = selection.set('focusOffset', focus.offset)
      selection = selection.set('isBackward', isBackward)
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
    const { renderMark, renderNode, state } = this.props

    if (node instanceof TextModel) {
      return (
        <Text
          key={node.key}
          node={node}
          renderMark={renderMark}
          state={state}
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
        state={state}
      />
    )
  }

}

/**
 * Export.
 */

export default Content

