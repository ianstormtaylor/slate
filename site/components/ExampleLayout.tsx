import React, { useState, ErrorInfo } from 'react'
import { cx, css } from '@emotion/css'
import Link from 'next/link'
import { Icon } from '../examples/ts/components/index'

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
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      active: boolean
    },
    ref: React.Ref<HTMLAnchorElement>
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
  <div
    {...props}
    className={css`
      max-width: 42em;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
    `}
  />
)

export const Warning = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={css`
      max-width: 42em;
      margin: 20px auto;
      padding: 20px;
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

const EXAMPLES = [
  ['Android Tests', 'android-tests'],
  ['Checklists', 'check-lists'],
  ['Code Highlighting', 'code-highlighting'],
  ['Custom Placeholder', 'custom-placeholder'],
  ['Editable Voids', 'editable-voids'],
  ['Embeds', 'embeds'],
  ['Forced Layout', 'forced-layout'],
  ['Hovering Toolbar', 'hovering-toolbar'],
  ['Huge Document', 'huge-document'],
  ['Images', 'images'],
  ['Inlines', 'inlines'],
  ['Markdown Preview', 'markdown-preview'],
  ['Markdown Shortcuts', 'markdown-shortcuts'],
  ['Mentions', 'mentions'],
  ['Paste HTML', 'paste-html'],
  ['Plain Text', 'plaintext'],
  ['Read-only', 'read-only'],
  ['Rendering in iframes', 'iframe'],
  ['Rich Text', 'richtext'],
  ['Search Highlighting', 'search-highlighting'],
  ['Shadow DOM', 'shadow-dom'],
  ['Styling', 'styling'],
  ['Tables', 'tables'],
]

const HIDDEN_EXAMPLES = ['android-tests']
const NON_HIDDEN_EXAMPLES = EXAMPLES.filter(
  ([, path]) => !HIDDEN_EXAMPLES.includes(path)
)

interface ExampleLayoutProps {
  children: React.ReactNode
  exampleName?: string
  examplePath?: string
  error?: Error | null
  stackTrace?: ErrorInfo | null
}

export function ExampleLayout({
  children,
  exampleName,
  examplePath,
  error,
  stackTrace,
}: ExampleLayoutProps) {
  const [showTabs, setShowTabs] = useState<boolean>(false)

  return (
    <div>
      <Header>
        <Title>Slate Examples</Title>
        <LinkList>
          <A href="https://github.com/ianstormtaylor/slate">GitHub</A>
          <A href="https://docs.slatejs.org/">Docs</A>
        </LinkList>
      </Header>

      {exampleName && examplePath && (
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
            {exampleName}
            <A
              href={`https://github.com/ianstormtaylor/slate/blob/main/site/examples/js/${examplePath}.jsx`}
            >
              <Pill>JS Code</Pill>
            </A>
            <A
              href={`https://github.com/ianstormtaylor/slate/blob/main/site/examples/ts/${examplePath}.tsx`}
            >
              <Pill>TS Code</Pill>
            </A>
          </ExampleTitle>
        </ExampleHeader>
      )}

      <TabList isVisible={showTabs}>
        {NON_HIDDEN_EXAMPLES.map(([n, p]) => (
          <Link
            key={p as string}
            href="/examples/[example]"
            as={`/examples/${p}`}
            legacyBehavior
            passHref
          >
            <Tab
              onClick={() => setShowTabs(false)}
              active={p === examplePath}
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

      {error && stackTrace ? (
        <Warning>
          <p>An error was thrown by one of the example's React components!</p>
          <pre>
            <code>
              {error.stack}
              {'\n'}
              {stackTrace.componentStack}
            </code>
          </pre>
        </Warning>
      ) : (
        <ExampleContent>{children}</ExampleContent>
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
  )
}
