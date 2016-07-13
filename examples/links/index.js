
import { Editor, Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Map } from 'immutable'

/**
 * Node renderers.
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

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    console.groupCollapsed('Change!')
    console.log('Document:', state.document.toJS())
    console.log('Selection:', state.selection.toJS())
    console.log('Content:', Raw.serialize(state))
    console.groupEnd()
    this.setState({ state })
  }

}

/**
 * Export.
 */

export default Links
