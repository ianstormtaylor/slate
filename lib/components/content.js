
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

    // No selection is active, so unset `isFocused`.
    if (!native.rangeCount && selection.isFocused) {
      selection = selection.set('isFocused', false)
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

      selection = selection.merge({
        anchorKey: anchor.key,
        anchorOffset: anchor.offset,
        focusKey: focus.key,
        focusOffset: focus.offset,
        isBackward: isBackward,
        isFocused: true
      })

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

    const style = {
      whiteSpace: 'pre-wrap' // preserve adjacent whitespace and new lines
    }

    return (
      <div
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-type='content'
        onKeyDown={(e) => this.onKeyDown(e)}
        onSelect={(e) => this.onSelect(e)}
        style={style}
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

