import React, { useState } from 'react'
import { cx, css } from 'emotion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ErrorBoundary from 'react-error-boundary'

import { Icon } from '../../components'

import CheckLists from '../../examples/check-lists'
import EditableVoids from '../../examples/editable-voids'
import Embeds from '../../examples/embeds'
import ForcedLayout from '../../examples/forced-layout'
import HoveringToolbar from '../../examples/hovering-toolbar'
import HugeDocument from '../../examples/huge-document'
import Images from '../../examples/images'
import Links from '../../examples/links'
import MarkdownPreview from '../../examples/markdown-preview'
import MarkdownShortcuts from '../../examples/markdown-shortcuts'
import Mentions from '../../examples/mentions'
import PasteHtml from '../../examples/paste-html'
import PlainText from '../../examples/plaintext'
import ReadOnly from '../../examples/read-only'
import RichText from '../../examples/richtext'
import SearchHighlighting from '../../examples/search-highlighting'
import CodeHighlighting from '../../examples/code-highlighting'
import Tables from '../../examples/tables'

const EXAMPLES = [
  ['Checklists', CheckLists, 'check-lists'],
  ['Editable Voids', EditableVoids, 'editable-voids'],
  ['Embeds', Embeds, 'embeds'],
  ['Forced Layout', ForcedLayout, 'forced-layout'],
  ['Hovering Toolbar', HoveringToolbar, 'hovering-toolbar'],
  ['Huge Document', HugeDocument, 'huge-document'],
  ['Images', Images, 'images'],
  ['Links', Links, 'links'],
  ['Markdown Preview', MarkdownPreview, 'markdown-preview'],
  ['Markdown Shortcuts', MarkdownShortcuts, 'markdown-shortcuts'],
  ['Mentions', Mentions, 'mentions'],
  ['Paste HTML', PasteHtml, 'paste-html'],
  ['Plain Text', PlainText, 'plaintext'],
  ['Read-only', ReadOnly, 'read-only'],
  ['Rich Text', RichText, 'richtext'],
  ['Search Highlighting', SearchHighlighting, 'search-highlighting'],
  ['Code Highlighting', CodeHighlighting, 'code-highlighting'],
  ['Tables', Tables, 'tables'],
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

const A = props => (
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

const Tab = React.forwardRef(({ active, href, ...props }, ref) => (
  <a
    ref={ref}
    href={href}
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
))

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
  const { example = router.asPath.replace('/examples/', '') } = router.query
  const EXAMPLE = EXAMPLES.find(e => e[2] === example)
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
            <A href="https://github.com/ianstormtaylor/slate">GitHub</A>
            <A href="https://docs.slatejs.org/">Docs</A>
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
            <A
              href={`https://github.com/ianstormtaylor/slate/blob/master/site/examples/${path}.js`}
            >
              (View Source)
            </A>
          </ExampleTitle>
        </ExampleHeader>
        <TabList isVisible={showTabs}>
          {EXAMPLES.map(([n, , p]) => (
            <Link
              key={p}
              href="/examples/[example]"
              as={`/examples/${p}`}
              passHref
            >
              <Tab onClick={() => setShowTabs(false)}>{n}</Tab>
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

// Disable SSR because it results in a double rendering which makes debugging
// examples more challenging. No idea how any of this works.
const NoSsrExamplePage = dynamic(() => Promise.resolve(ExamplePage), {
  ssr: false,
})

NoSsrExamplePage.getInitialProps = () => {
  return {}
}

export default NoSsrExamplePage
