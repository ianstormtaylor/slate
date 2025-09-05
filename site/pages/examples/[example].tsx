import React, { useState, PropsWithChildren, Ref, ErrorInfo } from 'react'
import { cx, css } from '@emotion/css'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'

import { Icon } from '../../examples/ts/components/index'

// node
import { getAllExamples } from '../api'

type ExampleTuple = [name: string, component: React.ComponentType, path: string]

// Dynamic imports to reduce initial bundle size
const EXAMPLES: ExampleTuple[] = [
  [
    'Android Tests',
    dynamic(() => import('../../examples/ts/android-tests')),
    'android-tests',
  ],
  [
    'Checklists',
    dynamic(() => import('../../examples/ts/check-lists')),
    'check-lists',
  ],
  [
    'Code Highlighting',
    dynamic(() => import('../../examples/ts/code-highlighting')),
    'code-highlighting',
  ],
  [
    'Custom Placeholder',
    dynamic(() => import('../../examples/ts/custom-placeholder')),
    'custom-placeholder',
  ],
  [
    'Editable Voids',
    dynamic(() => import('../../examples/ts/editable-voids')),
    'editable-voids',
  ],
  ['Embeds', dynamic(() => import('../../examples/ts/embeds')), 'embeds'],
  [
    'Forced Layout',
    dynamic(() => import('../../examples/ts/forced-layout')),
    'forced-layout',
  ],
  [
    'Hovering Toolbar',
    dynamic(() => import('../../examples/ts/hovering-toolbar')),
    'hovering-toolbar',
  ],
  [
    'Huge Document',
    dynamic(() => import('../../examples/ts/huge-document')),
    'huge-document',
  ],
  ['Images', dynamic(() => import('../../examples/ts/images')), 'images'],
  ['Inlines', dynamic(() => import('../../examples/ts/inlines')), 'inlines'],
  [
    'Markdown Preview',
    dynamic(() => import('../../examples/ts/markdown-preview')),
    'markdown-preview',
  ],
  [
    'Markdown Shortcuts',
    dynamic(() => import('../../examples/ts/markdown-shortcuts')),
    'markdown-shortcuts',
  ],
  ['Mentions', dynamic(() => import('../../examples/ts/mentions')), 'mentions'],
  [
    'Paste HTML',
    dynamic(() => import('../../examples/ts/paste-html')),
    'paste-html',
  ],
  [
    'Plain Text',
    dynamic(() => import('../../examples/ts/plaintext')),
    'plaintext',
  ],
  [
    'Read-only',
    dynamic(() => import('../../examples/ts/read-only')),
    'read-only',
  ],
  [
    'Rendering in iframes',
    dynamic(() => import('../../examples/ts/iframe')),
    'iframe',
  ],
  [
    'Rich Text',
    dynamic(() => import('../../examples/ts/richtext')),
    'richtext',
  ],
  [
    'Search Highlighting',
    dynamic(() => import('../../examples/ts/search-highlighting')),
    'search-highlighting',
  ],
  [
    'Shadow DOM',
    dynamic(() => import('../../examples/ts/shadow-dom')),
    'shadow-dom',
  ],
  ['Styling', dynamic(() => import('../../examples/ts/styling')), 'styling'],
  ['Tables', dynamic(() => import('../../examples/ts/tables')), 'tables'],
]

const HIDDEN_EXAMPLES = ['android-tests']

const NON_HIDDEN_EXAMPLES = EXAMPLES.filter(
  ([, , path]) => !HIDDEN_EXAMPLES.includes(path)
)

const Header = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={css`
      align-items: center;
      background: #000;
      color: #aaa;
      display: flex;
      height: 42px;
      position: relative;
      z-index: 3; /* To appear above the underlay */
    `}
  />
)

const Title = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    {...props}
    className={css`
      margin-left: 1em;
    `}
  />
)

const LinkList = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={css`
      margin-left: auto;
      margin-right: 1em;
    `}
  />
)

const A = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
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

const Pill = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    {...props}
    className={css`
      background: #333;
      border-radius: 9999px;
      color: #aaa;
      padding: 0.2em 0.5em;
    `}
  />
)

const TabList = ({
  isVisible,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { isVisible?: boolean }) => (
  <div
    role="menu"
    aria-label="Examples navigation"
    aria-hidden={!isVisible}
    {...props}
    className={css`
      background-color: #222;
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding-top: 0.2em;
      position: absolute;
      transition:
        width 0.2s,
        visibility 0.2s;
      width: ${isVisible ? '200px' : '0'};
      white-space: nowrap;
      max-height: 70vh;
      z-index: 3; /* To appear above the underlay */
      visibility: ${isVisible ? 'visible' : 'hidden'};
    `}
  />
)

const TabListUnderlay = ({
  isVisible,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { isVisible?: boolean }) => (
  <div
    {...props}
    className={css`
      background-color: rgba(200, 200, 200, 0.8);
      display: ${isVisible ? 'block' : 'none'};
      height: 100%;
      top: 0;
      position: fixed;
      width: 100%;
      z-index: 2;
    `}
  />
)

const TabButton = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <button
    {...props}
    aria-label="Toggle examples menu"
    aria-haspopup="menu"
    className={css`
      margin-left: 0.8em;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;

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

const Tab = React.forwardRef(
  (
    {
      active,
      href,
      ...props
    }: PropsWithChildren<{
      active: boolean
      href: string
      [key: string]: unknown
    }>,
    ref: Ref<HTMLAnchorElement>
  ) => (
    <a
      ref={ref}
      href={href}
      role="menuitem"
      aria-current={active ? 'page' : undefined}
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
)

const Wrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
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

const ExampleHeader = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={css`
      align-items: center;
      background-color: #555;
      color: #ddd;
      display: flex;
      height: 42px;
      position: relative;
      z-index: 3; /* To appear above the underlay */
    `}
  />
)

const ExampleTitle = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    {...props}
    className={css`
      margin-left: 1em;
    `}
  />
)

const ExampleContent = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <Wrapper
    {...props}
    className={css`
      background: #fff;
    `}
  />
)

const Warning = (props: React.HTMLAttributes<HTMLDivElement>) => (
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

const ExamplePage = ({ example }: { example: string }) => {
  const [error, setError] = useState<Error | undefined>(undefined)
  const [stacktrace, setStacktrace] = useState<ErrorInfo | undefined>(undefined)
  const [showTabs, setShowTabs] = useState<boolean>(false)
  const EXAMPLE = EXAMPLES.find(e => e[2] === example)
  const [name, Component, path] = EXAMPLE!
  return (
    <ErrorBoundary
      onError={(error, stacktrace) => {
        setError(error)
        setStacktrace(stacktrace)
      }}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Warning>
          <p>An error was thrown by one of the example's React components!</p>
          <pre>
            <code>
              {error.stack}
              {'\n'}
              {stacktrace}
            </code>
          </pre>
          <button onClick={resetErrorBoundary}>Try again</button>
        </Warning>
      )}
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
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Escape') {
                setShowTabs(false)
              }
            }}
            aria-expanded={showTabs}
          >
            <Icon>menu</Icon>
          </TabButton>
          <ExampleTitle>
            {name}
            <A
              href={`https://github.com/ianstormtaylor/slate/blob/main/site/examples/js/${path}.jsx`}
            >
              <Pill>JS Code</Pill>
            </A>
            <A
              href={`https://github.com/ianstormtaylor/slate/blob/main/site/examples/ts/${path}.tsx`}
            >
              <Pill>TS Code</Pill>
            </A>
          </ExampleTitle>
        </ExampleHeader>
        <TabList isVisible={showTabs}>
          {NON_HIDDEN_EXAMPLES.map(([n, , p]) => (
            <Link
              key={p as string}
              href="/examples/[example]"
              as={`/examples/${p}`}
              legacyBehavior
              passHref
            >
              <Tab
                onClick={() => setShowTabs(false)}
                active={p === path}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Escape') {
                    setShowTabs(false)
                  }
                }}
              >
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
                <>
                  {error.stack}
                  {'\n'}
                  {stacktrace}
                </>
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
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
              setShowTabs(false)
            }
          }}
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

export async function getStaticPaths() {
  const paths = getAllExamples()

  return {
    paths: paths.map(path => ({
      params: {
        example: path,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({
  params,
}: {
  params: { example: string }
}) {
  return {
    props: {
      example: params.example,
    },
  }
}

export default NoSsrExamplePage
