import React, { useState, ErrorInfo } from 'react'
import Link from 'next/link'
import { Icon } from '../examples/ts/components/index'
import { NON_HIDDEN_EXAMPLES } from '../constants/examples'

const Header = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="example-header" />
)

const Title = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="example-title" />
)

const LinkList = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="example-link-list" />
)

const A = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a {...props} className="example-link" />
)

const Pill = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="example-pill" />
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
    className={`example-tab-list ${isVisible ? 'visible' : 'hidden'}`}
  />
)

const TabListUnderlay = ({
  isVisible,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { isVisible?: boolean }) => (
  <div
    {...props}
    className={`example-tab-list-underlay ${isVisible ? 'visible' : 'hidden'}`}
  />
)

const TabButton = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <button
    {...props}
    aria-label="Toggle examples menu"
    aria-haspopup="menu"
    className="example-tab-button"
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
      className={`example-tab ${active ? 'active' : ''}`}
    />
  )
)

const ExampleHeader = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="example-page-header" />
)

const ExampleTitle = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="example-page-title" />
)

const ExampleContent = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="example-content" />
)

export const Warning = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="example-warning" />
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
