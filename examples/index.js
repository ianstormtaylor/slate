
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRedirect, hashHistory } from 'react-router'

/**
 * Examples.
 */

import AutoMarkdown from './auto-markdown'
import Links from './links'
import PlainText from './plain-text'
import RichText from './rich-text'
import Tables from './tables'

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
      <div class="app">
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
        <Link className="tab" activeClassName="active" to="rich-text">Rich Text</Link>
        <Link className="tab" activeClassName="active" to="plain-text">Plain Text</Link>
        <Link className="tab" activeClassName="active" to="auto-markdown">Auto-markdown</Link>
        <Link className="tab" activeClassName="active" to="links">Links</Link>
        <Link className="tab" activeClassName="active" to="tables">Tables</Link>
      </div>
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
      <Route path="links" component={Links} />
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
