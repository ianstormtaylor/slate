
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRedirect, hashHistory } from 'react-router'

/**
 * Examples.
 */

import AutoMarkdown from './auto-markdown'
import CodeHighlighting from './code-highlighting'
import HoveringMenu from './hovering-menu'
import Images from './images'
import Links from './links'
import PasteHtml from './paste-html'
import PlainText from './plain-text'
import RichText from './rich-text'
import Tables from './tables'

/**
 * Perf.
 */

import Perf from 'react-addons-perf'

window.Perf = Perf

/**
 * Define our example app.
 *
 * @type {Component} App
 */

class App extends React.Component {

  /**
   * Render the example app.
   *
   * @return {Element} element
   */

  render() {
    return (
      <div className="app">
        {this.renderTabBar()}
        {this.renderExample()}
      </div>
    )
  }

  /**
   * Render the tab bar.
   *
   * @return {Element} element
   */

  renderTabBar() {
    return (
      <div className="tabs">
        {this.renderTab('Rich Text', 'rich-text')}
        {this.renderTab('Plain Text', 'plain-text')}
        {this.renderTab('Auto-markdown', 'auto-markdown')}
        {this.renderTab('Hovering Menu', 'hovering-menu')}
        {this.renderTab('Links', 'links')}
        {this.renderTab('Images', 'images')}
        {this.renderTab('Tables', 'tables')}
        {this.renderTab('Code Highlighting', 'code-highlighting')}
        {this.renderTab('Paste HTML', 'paste-html')}
      </div>
    )
  }

  /**
   * Render a tab with `name` and `slug`.
   *
   * @param {String} name
   * @param {String} slug
   */

  renderTab(name, slug) {
    return (
      <Link className="tab" activeClassName="active" to={slug}>{name}</Link>
    )
  }

  /**
   * Render the example.
   *
   * @return {Element} element
   */

  renderExample() {
    return (
      <div className="example">
        {this.props.children}
      </div>
    )
  }

}

/**
 * Router.
 *
 * @type {Element} router
 */

const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="rich-text" />
      <Route path="auto-markdown" component={AutoMarkdown} />
      <Route path="code-highlighting" component={CodeHighlighting} />
      <Route path="hovering-menu" component={HoveringMenu} />
      <Route path="images" component={Images} />
      <Route path="links" component={Links} />
      <Route path="paste-html" component={PasteHtml} />
      <Route path="plain-text" component={PlainText} />
      <Route path="rich-text" component={RichText} />
      <Route path="tables" component={Tables} />
    </Route>
  </Router>
)

/**
 * Mount the router.
 */

const root = document.body.querySelector('main')
ReactDOM.render(router, root)
