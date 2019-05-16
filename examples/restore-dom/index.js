import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import { Button, EditorValue, Icon, Instruction, Toolbar } from '../components'

/**
 * The Restore DOM example.
 *
 * This shows the usage of the `restoreDOM` command to rebuild the editor from
 * scratch causing all the nodes to force render even if there are no changes
 * to the DOM.
 *
 * The `onClickHighlight` method changes the internal state but normally the
 * change is not rendered because there is no change to Slate's internal
 * `value`.
 *
 * RestoreDOM also blows away the old render which makes it safe if the DOM
 * has been altered outside of React.
 *
 * @type {Component}
 */

class RestoreDOMExample extends React.Component {
  /**
   * Deserialize the initial editor value and set an initial highlight color.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
    bgcolor: '#ffeecc',
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
        <Instruction>
          <ol>
            <li>
              Click a brush to change color in state. Use refresh button to
              `restoreDOM` which renders changes.
            </li>
            <li>
              Press `!` button to corrupt DOM by removing `bold`. Backspace from
              start of `text` 5 times. Console will show error but Slate will
              recover by restoring DOM.
            </li>
          </ol>
        </Instruction>
        <Toolbar>
          {this.renderHighlightButton('#ffeecc')}
          {this.renderHighlightButton('#ffffcc')}
          {this.renderHighlightButton('#ccffcc')}
          {this.renderCorruptButton()}
          {this.renderRestoreButton()}
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
        />
        <EditorValue value={this.state.value} />
      </div>
    )
  }

  /**
   * Render a highlight button
   *
   * @param {String} bgcolor
   * @return {Element}
   */

  renderHighlightButton = bgcolor => {
    const isActive = this.state.bgcolor === bgcolor
    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickHighlight(bgcolor)}
        style={{ backgroundColor: bgcolor }}
      >
        <Icon>format_paint</Icon>
      </Button>
    )
  }

  /**
   * Render restoreDOM button
   */

  renderRestoreButton = () => {
    const { editor } = this

    function restoreDOM() {
      editor.restoreDOM()
    }

    return (
      <Button onMouseDown={restoreDOM}>
        <Icon>refresh</Icon>
      </Button>
    )
  }

  /**
   * Render a button to corrupt the DOM
   *
   *@return {Element}
   */

  renderCorruptButton = () => {
    /**
     * Corrupt the DOM by forcibly deleting the first instance we can find
     * of the `bold` text in the DOM.
     */

    function corrupt() {
      const boldEl = window.document.querySelector('[data-bold]')
      const el = boldEl.closest('[data-slate-object="text"]')
      el.parentNode.removeChild(el)
    }
    return (
      <Button onMouseDown={corrupt}>
        <Icon>error_outline</Icon>
      </Button>
    )
  }

  /**
   * Highlight every block with a given background color
   *
   * @param {String} bgcolor
   */

  onClickHighlight = bgcolor => {
    const { editor } = this
    this.setState({ bgcolor })
  }

  /**
   * Render a Slate block.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props
    const style = { backgroundColor: this.state.bgcolor }

    switch (node.type) {
      case 'paragraph':
        return (
          <p {...attributes} style={style}>
            {children}
          </p>
        )
      default:
        return next()
    }
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
        // Added `data-bold` so we can find bold text with `querySelector`
        return (
          <strong {...attributes} data-bold>
            {children}
          </strong>
        )
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }
}

/**
 * Export.
 */

export default RestoreDOMExample
