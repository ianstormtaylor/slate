import React from 'react'
import styled from 'react-emotion'
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
import InputTester from './input-tester'
import SyncingOperations from './syncing-operations'
import Tables from './tables'
import Mentions from './mentions'

/**
 * Examples.
 *
 * @type {Array}
 */

const EXAMPLES = [
  ['Check Lists', CheckLists, '/check-lists'],
  ['Code Highlighting', CodeHighlighting, '/code-highlighting'],
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
 * Some styled components.
 *
 * @type {Component}
 */

const Nav = styled('div')`
  align-items: center;
  background: #000;
  color: #aaa;
  display: flex;
  height: 42px;
  position: relative;
  z-index: 1; /* To appear above the underlay */
`

const Title = styled('span')`
  margin-left: 1em;
`

const LinkList = styled('div')`
  margin-left: auto;
  margin-right: 1em;
`

const Link = styled('a')`
  margin-left: 1em;
  color: #aaa;
  text-decoration: none;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`

const TabList = styled('div')`
  background-color: #222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 0.2em;
  position: absolute;
  transition: width 0.2s;
  width: ${props => (props.isVisible ? '200px' : '0')};
  white-space: nowrap;
  z-index: 1;
`

const TabListUnderlay = styled('div')`
  background-color: rgba(200, 200, 200, 0.8);
  display: ${props => (props.isVisible ? 'block' : 'none')};
  height: 100%;
  top: 0;
  position: fixed;
  width: 100%;
`

const TabButton = styled('span')`
  margin-left: 0.8em;

  &:hover {
    cursor: pointer;
  }

  .material-icons {
    color: #aaa;
    font-size: 24px;
  }
`

const MaskedRouterLink = ({ active, ...props }) => <RouterLink {...props} />

const Tab = styled(MaskedRouterLink)`
  display: inline-block;
  margin-bottom: 0.2em;
  padding: 0.2em 1em;
  border-radius: 0.2em;
  text-decoration: none;
  color: ${p => (p.active ? 'white' : '#777')};
  background: ${p => (p.active ? '#333' : 'transparent')};

  &:hover {
    background: #333;
  }
`

const Wrapper = styled('div')`
  max-width: 42em;
  margin: 0 auto 20px;
  padding: 20px;
`

const ExampleTitle = styled('div')`
  align-items: center;
  background-color: #555;
  color: #ddd;
  display: flex;
  height: 42px;
  padding-left: 1em;
`

const ExampleContent = styled(Wrapper)`
  background: #fff;
`

const Warning = styled(Wrapper)`
  background: #fffae0;

  & > pre {
    background: #fbf1bd;
    white-space: pre;
    overflow-x: scroll;
    margin-bottom: 0;
  }
`

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
          <Nav>
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
            <Title>Slate Examples</Title>
            <LinkList>
              <Link href="https://github.com/ianstormtaylor/slate">GitHub</Link>
              <Link href="https://docs.slatejs.org/">Docs</Link>
            </LinkList>
          </Nav>
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
          {this.state.error ? (
            <Warning>
              <p>
                An error was thrown by one of the example's React components!
              </p>
              <pre>
                <code>
                  {this.state.error.stack}
                  {'\n'}
                  {this.state.info.componentStack}
                </code>
              </pre>
            </Warning>
          ) : (
            <Switch>
              {EXAMPLES.map(([name, Component, path]) => (
                <Route key={path} path={path}>
                  <div>
                    <ExampleTitle>{name}</ExampleTitle>
                    <ExampleContent>
                      <Component />
                    </ExampleContent>
                  </div>
                </Route>
              ))}
              <Redirect from="/" to="/rich-text" />
            </Switch>
          )}
          <TabListUnderlay
            isVisible={this.state.isTabListVisible}
            onClick={this._hideTabList}
          />
        </div>
      </HashRouter>
    )
  }

  _hideTabList = () => {
    this.setState({ isTabListVisible: false })
  }
}
