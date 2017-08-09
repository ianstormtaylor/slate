
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, NavLink, Route, Redirect, Switch } from 'react-router-dom'

import CheckLists from './check-lists'
import CodeHighlighting from './code-highlighting'
import Embeds from './embeds'
import Emojis from './emojis'
import FocusBlur from './focus-blur'
import ForcedLayout from './forced-layout'
import HoveringMenu from './hovering-menu'
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
import Tables from './tables'

import DevLargeDocument from './dev/large-document'
import DevPerformancePlain from './dev/performance-plain'
import DevPerformanceRich from './dev/performance-rich'

/**
 * Environment.
 *
 * @type {String}
 */

const { NODE_ENV } = process.env

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
  ['Embeds', Embeds, '/embeds'],
  ['Emojis', Emojis, '/emojis'],
  ['Markdown Preview', MarkdownPreview, '/markdown-preview'],
  ['Markdown Shortcuts', MarkdownShortcuts, '/markdown-shortcuts'],
  ['Check Lists', CheckLists, '/check-lists'],
  ['Code Highlighting', CodeHighlighting, '/code-highlighting'],
  ['Tables', Tables, '/tables'],
  ['Paste HTML', PasteHtml, '/paste-html'],
  ['Read-only', ReadOnly, '/read-only'],
  ['RTL', RTL, '/rtl'],
  ['Plugins', Plugins, '/plugins'],
  ['Iframes', Iframes, '/iframes'],
  ['Focus & Blur', FocusBlur, '/focus-blur'],
  ['Forced Layout', ForcedLayout, '/forced-layout'],

  ['DEV:Large', DevLargeDocument, '/dev-large', true],
  ['DEV:Plain', DevPerformancePlain, '/dev-performance-plain', true],
  ['DEV:Rich', DevPerformanceRich, '/dev-performance-rich', true],
]

/**
 * App.
 *
 * @type {Component}
 */

class App extends React.Component {

  render() {
    return (
      <div className="app">
        <div className="nav">
          <span className="nav-title">Slate Examples</span>
          <div className="nav-links">
            <a className="nav-link" href="https://github.com/ianstormtaylor/slate">GitHub</a>
            <a className="nav-link" href="https://docs.slatejs.org/">Docs</a>
          </div>
        </div>
        <div className="tabs">
          {EXAMPLES.map(([ name, Component, path, isDev ]) => (
            (NODE_ENV != 'production' || !isDev) && (
              <NavLink key={path} to={path} className="tab"activeClassName="active">
                {name}
              </NavLink>
            )
          ))}
        </div>
        <div className="example">
          <Switch>
            {EXAMPLES.map(([ name, Component, path, isDev ]) => (
              <Route key={path} path={path} component={Component} />
            ))}
            <Redirect from="/" to="/rich-text" />
          </Switch>
        </div>
      </div>
    )
  }

}

/**
 * Router.
 *
 * @type {Element} router
 */

const router = <HashRouter><App /></HashRouter>

/**
 * Attach `Perf` when not in production.
 */

if (NODE_ENV != 'production') {
  window.Perf = require('react-addons-perf')
}

/**
 * Mount the router.
 */

const root = document.body.querySelector('main')
ReactDOM.render(router, root)
