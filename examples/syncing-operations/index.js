import { Editor } from '@gitbook/slate-react'
import { Value } from '@gitbook/slate'

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

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
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

  renderMark = props => {
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
    }
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
   * When editor one changes, send document-alterting operations to edtior two.
   *
   * @param {Array} operations
   */

  onOneChange = change => {
    const ops = change.operations
      .filter(o => o.type != 'set_selection' && o.type != 'set_value')
      .toJS()

    setTimeout(() => {
      this.two.applyOperations(ops)
    })
  }

  /**
   * When editor two changes, send document-alterting operations to edtior one.
   *
   * @param {Array} operations
   */

  onTwoChange = change => {
    const ops = change.operations
      .filter(o => o.type != 'set_selection' && o.type != 'set_value')
      .toJS()

    setTimeout(() => {
      this.one.applyOperations(ops)
    })
  }
}

/**
 * Export.
 */

export default SyncingOperationsExample
