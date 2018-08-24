import React from 'react'
import { HashRouter, NavLink, Route, Redirect, Switch } from 'react-router-dom'

import CheckLists from './check-lists'
import CodeHighlighting from './code-highlighting'
import Embeds from './embeds'
import Emojis from './emojis'
import ForcedLayout from './forced-layout'
import History from './history'
import HoveringMenu from './hovering-menu'
import HugeDocument from './huge-document'
import Iframes from './iframes'
import Images from './images'
import Links from './links'
import MarkdownPreview from './markdown-preview'
import MarkdownShortcuts from './markdown-shortcuts'
import PasteHtml from './paste-html'
import PlainText from './plain-text'
import Plugins from './plugins'
import RTL from './rtl'
import ReadOnly from './read-only'
import RichText from './rich-text'
import SearchHighlighting from './search-highlighting'
import SyncingOperations from './syncing-operations'
import Tables from './tables'

/**
 * Examples.
 *
 * @type {Array}
 */

const EXAMPLES = [
  ['Rich Text', RichText, '/rich-text'],
  ['Plain Text', PlainText, '/plain-text'],
  ['Hovering Menu', HoveringMenu, '/hovering-menu'],
  ['Links', Links, '/links'],
  ['Images', Images, '/images'],
  ['Iframes', Iframes, '/iframes'],
  ['Embeds', Embeds, '/embeds'],
  ['Emojis', Emojis, '/emojis'],
  ['Markdown Preview', MarkdownPreview, '/markdown-preview'],
  ['Markdown Shortcuts', MarkdownShortcuts, '/markdown-shortcuts'],
  ['Check Lists', CheckLists, '/check-lists'],
  ['Code Highlighting', CodeHighlighting, '/code-highlighting'],
  ['Tables', Tables, '/tables'],
  ['Paste HTML', PasteHtml, '/paste-html'],
  ['Search Highlighting', SearchHighlighting, '/search-highlighting'],
  ['Syncing Operations', SyncingOperations, '/syncing-operations'],
  ['Read-only', ReadOnly, '/read-only'],
  ['RTL', RTL, '/rtl'],
  ['Plugins', Plugins, '/plugins'],
  ['Forced Layout', ForcedLayout, '/forced-layout'],
  ['Huge Document', HugeDocument, '/huge-document'],
  ['History', History, '/history'],
]

/**
 * App.
 *
 * @type {Component}
 */

export default class App extends React.Component {
  state = {
    error: null,
    info: null,
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
  }

  render() {
    return (
      <HashRouter>
        <div className="app">
          <div className="nav">
            <span className="nav-title">Slate Examples</span>
            <div className="nav-links">
              <a
                className="nav-link"
                href="https://github.com/ianstormtaylor/slate"
              >
                GitHub
              </a>
              <a className="nav-link" href="https://docs.slatejs.org/">
                Docs
              </a>
            </div>
          </div>
          <div className="tabs">
            {EXAMPLES.map(([name, Component, path]) => (
              <NavLink
                key={path}
                to={path}
                className="tab"
                activeClassName="active"
              >
                {name}
              </NavLink>
            ))}
          </div>
          {this.state.error ? this.renderError() : this.renderExample()}
        </div>
      </HashRouter>
    )
  }

  renderExample() {
    return (
      <div className="example">
        <Switch>
          {EXAMPLES.map(([name, Component, path]) => (
            <Route key={path} path={path} component={Component} />
          ))}
          <Redirect from="/" to="/rich-text" />
        </Switch>
      </div>
    )
  }

  renderError() {
    return (
      <div className="error">
        <p>An error was thrown by one of the example's React components!</p>
        <pre className="info">
          <code>
            {this.state.error.stack}
            {'\n'}
            {this.state.info.componentStack}
          </code>
        </pre>
      </div>
    )
  }
}
