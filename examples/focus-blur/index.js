
import { Editor, Raw } from '../..'
import React from 'react'
import initialState from './state.json'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    paragraph: props => <p>{props.children}</p>
  }
}

/**
 * The focus and blur example.
 *
 * @type {Component}
 */

class FocusBlur extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * Apply a focus or blur transform by `name` after a `timeout`.
   *
   * @param {String} name
   * @param {Number} timeout
   */

  onClick = (e, name, timeout = 0) => {
    e.preventDefault()

    setTimeout(() => {
      const state = this.state.state
        .transform()
        [name]()
        .apply()

      this.setState({ state })
    }, timeout)
  }

  /**
   * Generate focus and blur button handlers.
   *
   * @param {Event} e
   */

  onClickFocus = e => this.onClick(e, 'focus')
  onClickFocusDelay = e => this.onClick(e, 'focus', 3000)
  onClickBlur = e => this.onClick(e, 'blur')
  onClickBlurDelay = e => this.onClick(e, 'blur', 3000)

  /**
   * Render the app.
   *
   * @return {Element} element
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
   * @return {Element} element
   */

  renderToolbar = () => {
    return (
      <div className="menu toolbar-menu">
        <span className="button" onMouseDown={this.onClickFocus}>
          <span className="material-icons">done</span> Focus
        </span>
        <span className="button" onMouseDown={this.onClickFocusDelay}>
          <span className="material-icons">timer</span> Focus
        </span>
        <span className="button" onMouseDown={this.onClickBlur}>
          <span className="material-icons">done</span> Blur
        </span>
        <span className="button" onMouseDown={this.onClickBlurDelay}>
          <span className="material-icons">timer</span> Blur
        </span>
      </div>
    )
  }

  /**
   * Render the editor.
   *
   * @return {Element} element
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          autoFocus
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
          onPaste={this.onPaste}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default FocusBlur
