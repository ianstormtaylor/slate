import React from 'react'
import styled from 'react-emotion'
import {
  HashRouter,
  Link as RouterLink,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'

import CheckLists from './check-lists'
import CodeHighlighting from './code-highlighting'
import Embeds from './embeds'
import Emojis from './emojis'
import ForcedLayout from './forced-layout'
import History from './history'
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
  ['Search Highlighting', SearchHighlighting, '/search-highlighting'],
  ['Syncing Operations', SyncingOperations, '/syncing-operations'],
  ['Read-only', ReadOnly, '/read-only'],
  ['RTL', RTL, '/rtl'],
  ['Plugins', Plugins, '/plugins'],
  ['Forced Layout', ForcedLayout, '/forced-layout'],
  ['Huge Document', HugeDocument, '/huge-document'],
  ['History', History, '/history'],
  ['Input Tester', InputTester, '/input-tester'],
]

/**
 * Some styled components.
 *
 * @type {Component}
 */

const Nav = styled('div')`
  padding: 10px 15px;
  color: #aaa;
  background: #000;
`

const Title = styled('span')`
  margin-right: 0.5em;
`

const LinkList = styled('div')`
  float: right;
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
  padding: 15px 15px;
  background-color: #222;
  text-align: center;
  margin-bottom: 30px;

  & > * + * {
    margin-left: 0.5em;
  }
`

const MaskedRouterLink = ({ active, ...props }) => <RouterLink {...props} />

const Tab = styled(MaskedRouterLink)`
  display: inline-block;
  margin-bottom: 0.2em;
  padding: 0.2em 0.5em;
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

const Example = styled(Wrapper)`
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
            <Title>Slate Examples</Title>
            <LinkList>
              <Link href="https://github.com/ianstormtaylor/slate">GitHub</Link>
              <Link href="https://docs.slatejs.org/">Docs</Link>
            </LinkList>
          </Nav>
          <TabList>
            {EXAMPLES.map(([name, Component, path]) => (
              <Route key={path} exact path={path}>
                {({ match }) => (
                  <Tab to={path} active={match && match.isExact}>
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
            <Example>
              <Switch>
                {EXAMPLES.map(([name, Component, path]) => (
                  <Route key={path} path={path} component={Component} />
                ))}
                <Redirect from="/" to="/rich-text" />
              </Switch>
            </Example>
          )}
        </div>
      </HashRouter>
    )
  }
}
