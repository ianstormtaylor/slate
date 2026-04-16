import Link from 'next/link'
import React, { type ErrorInfo, useState } from 'react'
import { NON_HIDDEN_EXAMPLES } from '../constants/examples'
import { Icon } from '../examples/ts/components/index'

const Header = (props: React.ComponentProps<'div'>) => (
  <div {...props} className="example-header" />
)

const Title = (props: React.ComponentProps<'span'>) => (
  <span {...props} className="example-title" />
)

const LinkList = (props: React.ComponentProps<'div'>) => (
  <div {...props} className="example-link-list" />
)

const A = (props: React.ComponentProps<'a'>) => (
  <a {...props} className="example-link" />
)

const Pill = (props: React.ComponentProps<'span'>) => (
  <span {...props} className="example-pill" />
)

const TabList = ({
  isVisible,
  ...props
}: React.ComponentProps<'div'> & { isVisible?: boolean }) => (
  <div
    aria-hidden={!isVisible}
    aria-label="Examples navigation"
    role="menu"
    {...props}
    className={`example-tab-list ${isVisible ? 'visible' : 'hidden'}`}
  />
)

const TabListUnderlay = ({
  isVisible,
  ...props
}: React.ComponentProps<'div'> & { isVisible?: boolean }) => (
  <div
    {...props}
    className={`example-tab-list-underlay ${isVisible ? 'visible' : 'hidden'}`}
  />
)

const TabButton = (props: React.ComponentProps<'button'>) => (
  <button
    {...props}
    aria-haspopup="menu"
    aria-label="Toggle examples menu"
    className="example-tab-button"
  />
)

const Tab = ({
  active,
  href,
  ...props
}: React.ComponentProps<'a'> & {
  active: boolean
}) => (
  <a
    aria-current={active ? 'page' : undefined}
    href={href}
    role="menuitem"
    {...props}
    className={`example-tab ${active ? 'active' : ''}`}
  />
)

const ExampleHeader = (props: React.ComponentProps<'div'>) => (
  <div {...props} className="example-page-header" />
)

const ExampleTitle = (props: React.ComponentProps<'span'>) => (
  <span {...props} className="example-page-title" />
)

const ExampleContent = (props: React.ComponentProps<'div'>) => (
  <div {...props} className="example-content" />
)

export const Warning = (props: React.ComponentProps<'div'>) => (
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
            aria-expanded={showTabs}
            onClick={(e) => {
              e.stopPropagation()
              setShowTabs(!showTabs)
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Escape') {
                setShowTabs(false)
              }
            }}
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
            as={`/examples/${p}`}
            href="/examples/[example]"
            key={p as string}
            legacyBehavior
            passHref
          >
            <Tab
              active={p === examplePath}
              onClick={() => setShowTabs(false)}
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
