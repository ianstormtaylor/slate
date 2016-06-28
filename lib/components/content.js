
import OffsetKey from '../utils/offset-key'
import React from 'react'
import ReactDOM from 'react-dom'
import Text from './text'
import keycode from 'keycode'
import { isCommand, isWindowsCommand } from '../utils/event'

/**
 * Content.
 */

class Content extends React.Component {

  /**
   * Props.
   */

  static propTypes = {
    onBeforeInput: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onCopy: React.PropTypes.func,
    onCut: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onPaste: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    renderMark: React.PropTypes.func.isRequired,
    renderNode: React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  };

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean} shouldUpdate
   */

  shouldComponentUpdate(props, state) {
    if (props.state == this.props.state) return false
    if (props.state.document == this.props.state.document) return false
    if (props.state.isNative) return false
    return true
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
   * On certain events, bubble up.
   *
   * @param {String} name
   * @param {Event} e
   */

  onEvent(name, e) {
    this.props[name](e)
  }

  /**
   * On key down, prevent the default behavior of certain commands that will
   * leave the editor in an out-of-sync state, then bubble up.
   *
   * @param {Event} e
   */

  onKeyDown(e) {
    const key = keycode(e.which)

    if (
      (key == 'enter') ||
      (key == 'backspace') ||
      (key == 'delete') ||
      (key == 'b' && isCommand(e)) ||
      (key == 'i' && isCommand(e)) ||
      (key == 'y' && isWindowsCommand(e)) ||
      (key == 'z' && isCommand(e))
    ) {
      e.preventDefault()
    }

    this.props.onKeyDown(e)
  }

  /**
   * On paste, determine the type and bubble up.
   *
   * @param {Event} e
   */

  onPaste(e) {
    e.preventDefault()
    const data = e.clipboardData
    const { types } = data
    const paste = {}

    // Handle files.
    if (data.files.length != 0) {
      paste.type = 'files'
      paste.files = data.files
    }

    // Treat it as rich text if there is HTML content.
    else if (types.includes('text/plain') && types.includes('text/html')) {
      paste.type = 'html'
      paste.text = data.getData('text/plain')
      paste.html = data.getData('text/html')
    }

    // Treat everything else as plain text.
    else {
      paste.type = 'text'
      paste.text = data.getData('text/plain')
    }

    paste.data = data
    this.props.onPaste(e, paste)
  }

  /**
   * On select, update the current state's selection.
   *
   * @param {Event} e
   */

  onSelect(e) {
    let { state } = this.props
    let { document, selection } = state
    const native = window.getSelection()

    if (!native.rangeCount) {
      selection = selection.merge({ isFocused: false })
      state = state.merge({ selection })
      this.onChange(state)
      return
    }

    const el = ReactDOM.findDOMNode(this)
    const { anchorNode, anchorOffset, focusNode, focusOffset } = native
    const anchor = OffsetKey.findPoint(anchorNode, anchorOffset)
    const focus = OffsetKey.findPoint(focusNode, focusOffset)

    selection = selection.merge({
      anchorKey: anchor.key,
      anchorOffset: anchor.offset,
      focusKey: focus.key,
      focusOffset: focus.offset,
      isFocused: true
    })

    selection = selection.normalize(document)
    state = state.merge({ selection })
    this.onChange(state)
  }

  /**
   * Render the editor content.
   *
   * @return {Component} component
   */

  render() {
    const { state } = this.props
    const { document } = state
    const children = document.nodes
      .map(node => this.renderNode(node))
      .toArray()

    const style = {
      outline: 'none', // prevent the default outline styles
      whiteSpace: 'pre-wrap', // preserve adjacent whitespace and new lines
      wordWrap: 'break-word' // allow words to break if they are too long
    }

    return (
      <div
        contentEditable suppressContentEditableWarning
        style={style}
        onKeyDown={e => this.onKeyDown(e)}
        onSelect={e => this.onSelect(e)}
        onPaste={e => this.onPaste(e)}
        onCopy={e => this.onEvent('onCopy', e)}
        onCut={e => this.onEvent('onCut', e)}
        onBeforeInput={e => this.onEvent('onBeforeInput', e)}
      >
        {children}
      </div>
    )
  }

  /**
   * Render a `node`.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderNode(node) {
    switch (node.kind) {
      case 'text':
        return this.renderText(node)
      case 'block':
      case 'inline':
        return this.renderElement(node)
    }
  }

  /**
   * Render a text `node`.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderText(node) {
    const { renderMark, renderNode, state } = this.props
    return (
      <Text
        key={node.key}
        node={node}
        renderMark={renderMark}
        state={state}
      />
    )
  }

  /**
   * Render an element `node`.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderElement(node) {
    const { renderNode, state } = this.props
    const Component = renderNode(node)
    const children = node.nodes
      .map(child => this.renderNode(child))
      .toArray()

    return (
      <Component
        key={node.key}
        node={node}
        state={state}
      >
        {children}
      </Component>
    )

  }

}

/**
 * Export.
 */

export default Content

