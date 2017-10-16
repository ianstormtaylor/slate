
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import isHotkey from 'is-hotkey'
import initialState from './state.json'

/**
 * Hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isHotkey('mod+b')
const isItalicHotkey = isHotkey('mod+i')
const isUnderlinedHotkey = isHotkey('mod+u')
const isCodeHotkey = isHotkey('mod+`')

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  marks: {
    bold: {
      fontWeight: 'bold'
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px',
      borderRadius: '4px'
    },
    italic: {
      fontStyle: 'italic'
    },
    underlined: {
      textDecoration: 'underline'
    }
  }
}

/**
 * A simple editor component to demo syncing with.
 *
 * @type {Component}
 */

class SyncingEditor extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState),
  }

  /**
   * When new `operations` are received from one of the other editors that is in
   * sync with this one, apply them in a new change.
   *
   * @param {Array} operations
   */

  applyOperations = (operations) => {
    const { state } = this.state
    const change = state.change().applyOperations(operations)
    this.onChange(change, { remote: true })
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { state } = this.state
    return state.activeMarks.some(mark => mark.type == type)
  }

  /**
   * On change, save the new `state`. And if it's a local change, call the
   * passed-in `onChange` handler.
   *
   * @param {Change} change
   * @param {Object} options
   */

  onChange = (change, options = {}) => {
    this.setState({ state: change.state })

    if (!options.remote) {
      this.props.onChange(change)
    }
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (e, data, change) => {
    let mark

    if (isBoldHotkey(e)) {
      mark = 'bold'
    } else if (isItalicHotkey(e)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(e)) {
      mark = 'underlined'
    } else if (isCodeHotkey(e)) {
      mark = 'code'
    } else {
      return
    }

    e.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark = (e, type) => {
    e.preventDefault()
    const { state } = this.state
    const change = state.change().toggleMark(type)
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
    const onMouseDown = e => this.onClickMark(e, type)

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
          state={this.state.state}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          schema={schema}
          placeholder={'Enter some rich text...'}
          spellCheck
        />
      </div>
    )
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
    const ops = change.operations.filter(o => o.type != 'set_selection' && o.type != 'set_state')
    this.two.applyOperations(ops)
  }

  /**
   * When editor two changes, send document-alterting operations to edtior one.
   *
   * @param {Array} operations
   */

  onTwoChange = (change) => {
    const ops = change.operations.filter(o => o.type != 'set_selection' && o.type != 'set_state')
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
