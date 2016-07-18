
import { Editor, Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import isUrl from 'is-url'
import { Map } from 'immutable'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */

const NODES = {
  paragraph: props => <p>{props.children}</p>,
  link: (props) => {
    const { data } = props.node
    const href = data.get('href')
    return <a {...props.attributes} href={href}>{props.children}</a>
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
    state: Raw.deserialize(initialState)
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
        .wrapInline('link', new Map({ href }))
        .apply()
    }

    else {
      const href = window.prompt('Enter the URL of the link:')
      const text = window.prompt('Enter the text for the link:')
      state = state
        .transform()
        .insertText(text)
        .extendBackward(text.length)
        .wrapInline('link', new Map({ href }))
        .collapseToEnd()
        .apply()
    }

    this.setState({ state })
  }

  /**
   * On paste, if the text is a link, wrap the selection in a link.
   *
   * @param {Event} e
   * @param {Object} paste
   * @param {State} state
   */

  onPaste = (e, paste, state) => {
    if (state.isCollapsed) return
    if (paste.type != 'text' && paste.type != 'html') return
    if (!isUrl(paste.text)) return

    let transform = state.transform()

    if (this.hasLinks()) {
      transform = transform.unwrapInline('link')
    }

    return transform
      .wrapInline('link', { href: paste.text })
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
          state={this.state.state}
          renderNode={this.renderNode}
          onChange={this.onChange}
          onPaste={this.onPaste}
        />
      </div>
    )
  }

  /**
   * Render a `node`.
   *
   * @param {Node} node
   * @return {Element}
   */

  renderNode = (node) => {
    return NODES[node.type]
  }

}

/**
 * Export.
 */

export default Links
