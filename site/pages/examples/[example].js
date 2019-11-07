import React, { useState } from 'react'
import { cx, css } from 'emotion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorBoundary from 'react-error-boundary'

import { Icon } from '../../examples/components'

import CheckLists from '../../examples/check-lists'
// import CodeHighlighting from '../../examples/code-highlighting'
// import Embeds from '../../examples/embeds'
// import Emojis from '../../examples/emojis'
// import ForcedLayout from '../../examples/forced-layout'
// import History from '../../examples/history'
// import Versions from '../../examples/versions'
// import HoveringMenu from '../../examples/hovering-menu'
// import HugeDocument from '../../examples/huge-document'
import Images from '../../examples/images'
// import Links from '../../examples/links'
// import MarkdownPreview from '../../examples/markdown-preview'
// import MarkdownShortcuts from '../../examples/markdown-shortcuts'
// import PasteHtml from '../../examples/paste-html'
import PlainText from '../../examples/plain-text'
// import Plugins from '../../examples/plugins'
// import RTL from '../../examples/rtl'
import ReadOnly from '../../examples/read-only'
import RichText from '../../examples/rich-text'
// import SearchHighlighting from '../../examples/search-highlighting'
// import Composition from '../../examples/composition'
// import InputTester from '../../examples/input-tester'
// import SyncingOperations from '../../examples/syncing-operations'
// import Tables from '../../examples/tables'
// import Mentions from '../../examples/mentions'
// import Placeholder from '../../examples/placeholder'

const EXAMPLES = [
  ['Checklists', CheckLists, '/check-lists'],
  // ['Code Highlighting', CodeHighlighting, '/code-highlighting'],
  // ['Composition', Composition, '/composition/:subpage?'],
  // ['Embeds', Embeds, '/embeds'],
  // ['Emojis', Emojis, '/emojis'],
  // ['Forced Layout', ForcedLayout, '/forced-layout'],
  // ['History', History, '/history'],
  // ['Hovering Menu', HoveringMenu, '/hovering-menu'],
  // ['Huge Document', HugeDocument, '/huge-document'],
  ['Images', Images, '/images'],
  // ['Input Tester', InputTester, '/input-tester'],
  // ['Links', Links, '/links'],
  // ['Markdown Preview', MarkdownPreview, '/markdown-preview'],
  // ['Markdown Shortcuts', MarkdownShortcuts, '/markdown-shortcuts'],
  // ['Mentions', Mentions, '/mentions'],
  // ['Paste HTML', PasteHtml, '/paste-html'],
  // ['Placeholders', Placeholder, '/placeholder'],
  ['Plain Text', PlainText, '/plain-text'],
  // ['Plugins', Plugins, '/plugins'],
  ['Read-only', ReadOnly, '/read-only'],
  ['Rich Text', RichText, '/rich-text'],
  // ['RTL', RTL, '/rtl'],
  // ['Search Highlighting', SearchHighlighting, '/search-highlighting'],
  // ['Syncing Operations', SyncingOperations, '/syncing-operations'],
  // ['Tables', Tables, '/tables'],
  // ['Versions', Versions, '/versions'],
]

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
  <a
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

const ExamplePage = () => {
  const [error, setError] = useState()
  const [stacktrace, setStacktrace] = useState()
  const [showTabs, setShowTabs] = useState()
  const router = useRouter()
  const { example = 'rich-text' } = router.query
  const EXAMPLE = EXAMPLES.find(e => e[2] === `/${example}`)
  const [name, Component, path] = EXAMPLE

  return (
    <ErrorBoundary
      onError={(error, stacktrace) => {
        setError(error)
        setStacktrace(stacktrace)
      }}
    >
      <div>
        <Head>
          <title>Slate Examples</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/index.css" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin-ext"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <Header>
          <Title>Slate Examples</Title>
          <LinkList>
            <Link href="https://github.com/ianstormtaylor/slate">GitHub</Link>
            <Link href="https://docs.slatejs.org/">Docs</Link>
          </LinkList>
        </Header>
        <ExampleHeader>
          <TabButton
            onClick={e => {
              e.stopPropagation()
              setShowTabs(!showTabs)
            }}
          >
            <Icon>menu</Icon>
          </TabButton>
          <ExampleTitle>
            {name}
            <Link href="/examples/[example]" as={`/examples/${path}`}>
              (View Source)
            </Link>
          </ExampleTitle>
        </ExampleHeader>
        <TabList isVisible={showTabs}>
          {EXAMPLES.map(([n, , p]) => (
            <Link key={p} href="/examples/[example]" as={`/examples/${p}`}>
              <Tab active={p === path} onClick={() => setShowTabs(false)}>
                {n}
              </Tab>
            </Link>
          ))}
        </TabList>
        {error ? (
          <Warning>
            <p>An error was thrown by one of the example's React components!</p>
            <pre>
              <code>
                {error.stack}
                {'\n'}
                {stacktrace}
              </code>
            </pre>
          </Warning>
        ) : (
          <ExampleContent>
            <Component />
          </ExampleContent>
        )}
        <TabListUnderlay
          isVisible={showTabs}
          onClick={() => setShowTabs(false)}
        />
      </div>
    </ErrorBoundary>
  )
}

export default ExamplePage
