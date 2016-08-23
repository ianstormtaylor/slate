
import { Editor, Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import isUrl from 'is-url'
import { Map } from 'immutable'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    paragraph: props => <p>{props.children}</p>,
    link: (props) => {
      const { data } = props.node
      const href = data.get('href')
      return <a {...props.attributes} href={href}>{props.children}</a>
    }
  }
}

/**
 * The links example.
 *
 * @type {Component}
 */

class Links extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */

  hasLinks = () => {
    const { state } = this.state
    return state.inlines.some(inline => inline.type == 'link')
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} e
   */

  onClickLink = (e) => {
    e.preventDefault()
    let { state } = this.state
    const hasLinks = this.hasLinks()

    if (hasLinks) {
      state = state
        .transform()
        .unwrapInline('link')
        .apply()
    }

    else if (state.isExpanded) {
      const href = window.prompt('Enter the URL of the link:')
      state = state
        .transform()
        .wrapInline({
          type: 'link',
          data: { href }
        })
        .collapseToEnd()
        .apply()
    }

    else {
      const href = window.prompt('Enter the URL of the link:')
      const text = window.prompt('Enter the text for the link:')
      state = state
        .transform()
        .insertText(text)
        .extendBackward(text.length)
        .wrapInline({
          type: 'link',
          data: { href }
        })
        .collapseToEnd()
        .apply()
    }

    this.setState({ state })
  }

  /**
   * On paste, if the text is a link, wrap the selection in a link.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   */

  onPaste = (e, data, state) => {
    if (state.isCollapsed) return
    if (data.type != 'text' && data.type != 'html') return
    if (!isUrl(data.text)) return

    let transform = state.transform()

    if (this.hasLinks()) {
      transform = transform.unwrapInline('link')
    }

    return transform
      .wrapInline({
        type: 'link',
        data: {
          href: data.text
        }
      })
      .collapseToEnd()
      .apply()
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render = () => {
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
    const hasLinks = this.hasLinks()
    return (
      <div className="menu toolbar-menu">
        <span className="button" onMouseDown={this.onClickLink} data-active={hasLinks}>
          <span className="material-icons">link</span>
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

export default Links
