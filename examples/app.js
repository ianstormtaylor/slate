import React from 'react'
import { cx, css } from 'emotion'
import {
  HashRouter,
  Link as RouterLink,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'

import { Icon } from './components'
import CheckLists from './check-lists'
import CodeHighlighting from './code-highlighting'
import Embeds from './embeds'
import Emojis from './emojis'
import ForcedLayout from './forced-layout'
import History from './history'
import Versions from './versions'
import HoveringMenu from './hovering-menu'
import HugeDocument from './huge-document'
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
import Composition from './composition'
import InputTester from './input-tester'
import SyncingOperations from './syncing-operations'
import Tables from './tables'
import Mentions from './mentions'
import Placeholder from './placeholder'

/**
 * Examples.
 *
 * @type {Array}
 */

const EXAMPLES = [
  ['Checklists', CheckLists, '/check-lists'],
  ['Code Highlighting', CodeHighlighting, '/code-highlighting'],
  ['Composition', Composition, '/composition/:subpage?'],
  ['Embeds', Embeds, '/embeds'],
  ['Emojis', Emojis, '/emojis'],
  ['Forced Layout', ForcedLayout, '/forced-layout'],
  ['History', History, '/history'],
  ['Hovering Menu', HoveringMenu, '/hovering-menu'],
  ['Huge Document', HugeDocument, '/huge-document'],
  ['Images', Images, '/images'],
  ['Input Tester', InputTester, '/input-tester'],
  ['Links', Links, '/links'],
  ['Markdown Preview', MarkdownPreview, '/markdown-preview'],
  ['Markdown Shortcuts', MarkdownShortcuts, '/markdown-shortcuts'],
  ['Mentions', Mentions, '/mentions'],
  ['Paste HTML', PasteHtml, '/paste-html'],
  ['Placeholders', Placeholder, '/placeholders'],
  ['Plain Text', PlainText, '/plain-text'],
  ['Plugins', Plugins, '/plugins'],
  ['Read-only', ReadOnly, '/read-only'],
  ['Rich Text', RichText, '/rich-text'],
  ['RTL', RTL, '/rtl'],
  ['Search Highlighting', SearchHighlighting, '/search-highlighting'],
  ['Syncing Operations', SyncingOperations, '/syncing-operations'],
  ['Tables', Tables, '/tables'],
  ['Versions', Versions, '/versions'],
]

/**
 * Some components.
 *
 * @type {Component}
 */

const Header = props => (
  <div
    {...props}
    className={css`
      align-items: center;
      background: #000;
      color: #aaa;
      display: flex;
      height: 42px;
      position: relative;
      z-index: 1; /* To appear above the underlay */
    `}
  />
)

const Title = props => (
  <span
    {...props}
    className={css`
      margin-left: 1em;
    `}
  />
)

const LinkList = props => (
  <div
    {...props}
    className={css`
      margin-left: auto;
      margin-right: 1em;
    `}
  />
)

const Link = props => (
  <a
    {...props}
    className={css`
      margin-left: 1em;
      color: #aaa;
      text-decoration: none;

      &:hover {
        color: #fff;
        text-decoration: underline;
      }
    `}
  />
)

const TabList = ({ isVisible, ...props }) => (
  <div
    {...props}
    className={css`
      background-color: #222;
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding-top: 0.2em;
      position: absolute;
      transition: width 0.2s;
      width: ${isVisible ? '200px' : '0'};
      white-space: nowrap;
      max-height: 70vh;
      z-index: 1; /* To appear above the underlay */
    `}
  />
)

const TabListUnderlay = ({ isVisible, ...props }) => (
  <div
    {...props}
    className={css`
      background-color: rgba(200, 200, 200, 0.8);
      display: ${isVisible ? 'block' : 'none'};
      height: 100%;
      top: 0;
      position: fixed;
      width: 100%;
    `}
  />
)

const TabButton = props => (
  <span
    {...props}
    className={css`
      margin-left: 0.8em;

      &:hover {
        cursor: pointer;
      }

      .material-icons {
        color: #aaa;
        font-size: 24px;
      }
    `}
  />
)

const Tab = ({ active, ...props }) => (
  <RouterLink
    {...props}
    className={css`
      display: inline-block;
      margin-bottom: 0.2em;
      padding: 0.2em 1em;
      border-radius: 0.2em;
      text-decoration: none;
      color: ${active ? 'white' : '#777'};
      background: ${active ? '#333' : 'transparent'};

      &:hover {
        background: #333;
      }
    `}
  />
)

const Wrapper = ({ className, ...props }) => (
  <div
    {...props}
    className={cx(
      className,
      css`
        max-width: 42em;
        margin: 20px auto;
        padding: 20px;
      `
    )}
  />
)

const ExampleHeader = props => (
  <div
    {...props}
    className={css`
      align-items: center;
      background-color: #555;
      color: #ddd;
      display: flex;
      height: 42px;
      position: relative;
      z-index: 1; /* To appear above the underlay */
    `}
  />
)

const ExampleTitle = props => (
  <span
    {...props}
    className={css`
      margin-left: 1em;
    `}
  />
)

const ExampleContent = props => (
  <Wrapper
    {...props}
    className={css`
      background: #fff;
    `}
  />
)

const Warning = props => (
  <Wrapper
    {...props}
    className={css`
      background: #fffae0;

      & > pre {
        background: #fbf1bd;
        white-space: pre;
        overflow-x: scroll;
        margin-bottom: 0;
      }
    `}
  />
)

/**
 * App.
 *
 * @type {Component}
 */

export default class App extends React.Component {
  /**
   * Initial state.
   *
   * @type {Object}
   */

  state = {
    error: null,
    info: null,
    isTabListVisible: false,
  }

  /**
   * Catch the `error` and `info`.
   *
   * @param {Error} error
   * @param {Object} info
   */

  componentDidCatch(error, info) {
    this.setState({ error, info })
  }

  /**
   * Render the example app.
   *
   * @return {Element}
   */

  render() {
    return (
      <HashRouter>
        <div>
          {this.renderHeader()}
          {this.renderExampleHeader()}
          {this.renderTabList()}
          {this.state.error ? this.renderError() : this.renderExample()}
          <TabListUnderlay
            isVisible={this.state.isTabListVisible}
            onClick={this._hideTabList}
          />
        </div>
      </HashRouter>
    )
  }

  renderError() {
    return (
      <Warning>
        <p>An error was thrown by one of the example's React components!</p>
        <pre>
          <code>
            {this.state.error.stack}
            {'\n'}
            {this.state.info.componentStack}
          </code>
        </pre>
      </Warning>
    )
  }

  renderExample() {
    return (
      <Switch>
        {EXAMPLES.map(([name, Component, path]) => (
          <Route key={path} path={path}>
            {({ match }) => (
              <div>
                <ExampleContent>
                  <Component params={match.params} />
                </ExampleContent>
              </div>
            )}
          </Route>
        ))}
        <Redirect from="/" to="/rich-text" />
      </Switch>
    )
  }

  renderExampleHeader() {
    return (
      <ExampleHeader>
        <TabButton
          onClick={e => {
            e.stopPropagation()

            this.setState({
              isTabListVisible: !this.state.isTabListVisible,
            })
          }}
        >
          <Icon>menu</Icon>
        </TabButton>
        <Switch>
          {EXAMPLES.map(([name, Component, path]) => (
            <Route key={path} exact path={path}>
              <ExampleTitle>
                {name}
                <Link
                  href={`https://github.com/ianstormtaylor/slate/blob/master/examples${path}`}
                >
                  (View Source)
                </Link>
              </ExampleTitle>
            </Route>
          ))}
        </Switch>
      </ExampleHeader>
    )
  }

  renderHeader() {
    return (
      <Header>
        <Title>Slate Examples</Title>
        <LinkList>
          <Link href="https://github.com/ianstormtaylor/slate">GitHub</Link>
          <Link href="https://docs.slatejs.org/">Docs</Link>
        </LinkList>
      </Header>
    )
  }

  renderTabList() {
    return (
      <TabList isVisible={this.state.isTabListVisible}>
        {EXAMPLES.map(([name, Component, path]) => (
          <Route key={path} exact path={path}>
            {({ match }) => (
              <Tab
                to={path}
                active={match && match.isExact}
                onClick={this._hideTabList}
              >
                {name}
              </Tab>
            )}
          </Route>
        ))}
      </TabList>
    )
  }

  _hideTabList = () => {
    this.setState({ isTabListVisible: false })
  }
}
