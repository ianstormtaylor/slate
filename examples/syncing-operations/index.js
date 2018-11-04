import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import styled from 'react-emotion'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from '../components'

/**
 * A spacer component.
 *
 * @type {Component}
 */

const Spacer = styled('div')`
  height: 20px;
  background-color: #eee;
  margin: 20px -20px;
`

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

  applyOperations = operations => {
    this.remote = true
    operations.forEach(o => this.editor.applyOperation(o))
    this.remote = false
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </Toolbar>
        <Editor
          placeholder="Enter some text..."
          ref={this.ref}
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
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    return (
      <Button
        active={this.hasMark(type)}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`. And if it's a local change, call the
   * passed-in `onChange` handler.
   *
   * @param {Editor} editor
   * @param {Object} options
   */

  onChange = (change, options = {}) => {
    this.setState({ value: change.value })

    if (!this.remote) {
      this.props.onChange(change)
    }
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
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
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }
}

/**
 * The syncing operations example.
 *
 * @type {Component}
 */

class SyncingOperationsExample extends React.Component {
  /**
   * Render both editors.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <SyncingEditor
          ref={one => (this.one = one)}
          onChange={this.onOneChange}
        />
        <Spacer />
        <SyncingEditor
          ref={two => (this.two = two)}
          onChange={this.onTwoChange}
        />
      </div>
    )
  }

  /**
   * When editor one changes, send document-altering operations to editor two.
   *
   * @param {Array} operations
   */

  onOneChange = change => {
    const ops = change.operations
      .filter(
        o =>
          o.type != 'set_selection' &&
          o.type != 'set_value' &&
          (!o.data || !o.data.has('source'))
      )
      .toJS()
      .map(o => ({ ...o, data: { source: 'one' } }))

    setTimeout(() => this.two.applyOperations(ops))
  }

  /**
   * When editor two changes, send document-altering operations to editor one.
   *
   * @param {Array} operations
   */

  onTwoChange = change => {
    const ops = change.operations
      .filter(
        o =>
          o.type != 'set_selection' &&
          o.type != 'set_value' &&
          (!o.data || !o.data.has('source'))
      )
      .toJS()
      .map(o => ({ ...o, data: { source: 'two' } }))

    setTimeout(() => this.one.applyOperations(ops))
  }
}

/**
 * Export.
 */

export default SyncingOperationsExample
