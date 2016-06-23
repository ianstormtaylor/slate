
import Editor, { Mark, Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import state from './state.json'
import { Map } from 'immutable'

/**
 * App.
 */

class App extends React.Component {

  state = {
    state: Raw.deserialize(state)
  };

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */

  hasLinks() {
    let { state } = this.state
    const { currentInlineNodes } = state
    const hasLinks = currentInlineNodes.some(inline => inline.type == 'link')
    return hasLinks
  }

  /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} e
   */

  onClickLink(e) {
    e.preventDefault()
    let { state } = this.state
    const hasLinks = this.hasLinks()

    if (hasLinks) {
      state = state
        .transform()
        .unwrapInline('link')
        .apply()
    }

    else if (state.isCurrentlyExpanded) {
      // const href = window.prompt('Enter the URL of the link:')
      state = state
        .transform()
        .wrapInline('link', new Map({ href: 'https://google.com' }))
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
        .apply()
    }

    this.setState({ state })
  }

  /**
   * Render the app.
   *
   * @return {Component} component
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
   * @return {Component} component
   */

  renderToolbar() {
    const hasLinks = this.hasLinks()
    return (
      <div className="menu">
        <span className="button" onMouseDown={e => this.onClickLink(e)} data-active={hasLinks}>
          <span className="material-icons">link</span>
        </span>
      </div>
    )
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  renderEditor() {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={node => this.renderNode(node)}
          onChange={(state) => {
            console.groupCollapsed('Change!')
            console.log('Document:', state.document.toJS())
            console.log('Selection:', state.selection.toJS())
            console.log('Content:', Raw.serialize(state))
            console.groupEnd()
            this.setState({ state })
          }}
        />
      </div>
    )
  }

  /**
   * Render our custom `node`.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderNode(node) {
    switch (node.type) {
      case 'link': {
        return (props) => {
          const { data } = props.node
          const href = data.get('href')
          return <a href={href}>{props.children}</a>
        }
      }
      case 'paragraph': {
        return (props) => <p>{props.children}</p>
      }
    }
  }

}

/**
 * Attach.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
