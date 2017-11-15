
import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import { isKeyHotkey } from 'is-hotkey'

/**
 * Hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * A simple editor component to demo syncing with.
 *
 * @type {Component}
 */

class SyncingEditor extends React.Component {

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * When new `operations` are received from one of the other editors that is in
   * sync with this one, apply them in a new change.
   *
   * @param {Array} operations
   */

  applyOperations = (operations) => {
    const { value } = this.state
    const change = value.change().applyOperations(operations)
    this.onChange(change, { remote: true })
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * On change, save the new `value`. And if it's a local change, call the
   * passed-in `onChange` handler.
   *
   * @param {Change} change
   * @param {Object} options
   */

  onChange = (change, options = {}) => {
    this.setState({ value: change.value })

    if (!options.remote) {
      this.props.onChange(change)
    }
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => {
    return (
      <div className="menu toolbar-menu">
        {this.renderButton('bold', 'format_bold')}
        {this.renderButton('italic', 'format_italic')}
        {this.renderButton('underlined', 'format_underlined')}
        {this.renderButton('code', 'code')}
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderMark={this.renderMark}
          spellCheck
        />
      </div>
    )
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props) => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold': return <strong>{children}</strong>
      case 'code': return <code>{children}</code>
      case 'italic': return <em>{children}</em>
      case 'underlined': return <u>{children}</u>
    }
  }

}

/**
 * The syncing operations example.
 *
 * @type {Component}
 */

class SyncingOperationsExample extends React.Component {

  /**
   * Save a reference to editor `one`.
   *
   * @param {SyncingEditor} one
   */

  oneRef = (one) => {
    this.one = one
  }

  /**
   * Save a reference to editor `two`.
   *
   * @param {SyncingEditor} two
   */

  twoRef = (two) => {
    this.two = two
  }

  /**
   * When editor one changes, send document-alterting operations to edtior two.
   *
   * @param {Array} operations
   */

  onOneChange = (change) => {
    const ops = change.operations
      .filter(o => o.type != 'set_selection' && o.type != 'set_value')
      .map(o => o.toJSON())

    this.two.applyOperations(ops)
  }

  /**
   * When editor two changes, send document-alterting operations to edtior one.
   *
   * @param {Array} operations
   */

  onTwoChange = (change) => {
    const ops = change.operations
      .filter(o => o.type != 'set_selection' && o.type != 'set_value')
      .map(o => o.toJSON())

    this.one.applyOperations(ops)
  }

  /**
   * Render both editors.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <SyncingEditor
          ref={this.oneRef}
          onChange={this.onOneChange}
        />
        <div
          style={{
            height: '20px',
            backgroundColor: '#eee',
            margin: '20px -20px',
          }}
        />
        <SyncingEditor
          ref={this.twoRef}
          onChange={this.onTwoChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default SyncingOperationsExample
