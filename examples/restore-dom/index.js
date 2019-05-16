import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'

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
    bgcolor: '#ffffff',
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
          {this.renderHighlightButton('#ffffff')}
          {this.renderHighlightButton('#ffeecc')}
          {this.renderHighlightButton('#ffffcc')}
          {this.renderHighlightButton('#ccffcc')}
          {this.renderHighlightButton('#ccffff')}
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          renderBlock={this.renderBlock}
        />
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
   * Highlight every block with a given background color
   *
   * @param {String} bgcolor
   */

  onClickHighlight = bgcolor => {
    const { editor } = this
    this.setState({ bgcolor })
    editor.restoreDOM()
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
