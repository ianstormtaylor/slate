
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import initialState from './state.json'
import isUrl from 'is-url'

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
 * A change helper to standardize wrapping links.
 *
 * @param {Change} change
 * @param {String} href
 */

function wrapLink(change, href) {
  change.wrapInline({
    type: 'link',
    data: { href }
  })

  change.collapseToEnd()
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Change} change
 */

function unwrapLink(change) {
  change.unwrapInline('link')
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
    state: State.fromJSON(initialState)
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
   * @param {Change} change
   */

  onChange = ({ state }) => {
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
    const { state } = this.state
    const hasLinks = this.hasLinks()
    const change = state.change()

    if (hasLinks) {
      change.call(unwrapLink)
    }

    else if (state.isExpanded) {
      const href = window.prompt('Enter the URL of the link:')
      change.call(wrapLink, href)
    }

    else {
      const href = window.prompt('Enter the URL of the link:')
      const text = window.prompt('Enter the text for the link:')
      change
        .insertText(text)
        .extend(0 - text.length)
        .call(wrapLink, href)
    }

    this.onChange(change)
  }

  /**
   * On paste, if the text is a link, wrap the selection in a link.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  onPaste = (e, data, change) => {
    if (change.state.isCollapsed) return
    if (data.type != 'text' && data.type != 'html') return
    if (!isUrl(data.text)) return

    if (this.hasLinks()) {
      change.call(unwrapLink)
    }

    change.call(wrapLink, data.text)
    return true
  }

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
