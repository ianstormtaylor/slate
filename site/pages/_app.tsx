import React, { useState, ErrorInfo } from 'react'
import { AppProps } from 'next/app'
import { ErrorBoundary } from 'react-error-boundary'
import { Roboto } from 'next/font/google'
import { ExampleLayout, Warning } from '../components/ExampleLayout'

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <Warning>
      <p>An error was thrown by one of the example's React components!</p>
      <pre>
        <code>{error.stack}</code>
      </pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </Warning>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const [error, setError] = useState<Error | undefined>(undefined)
  const [stackTrace, setStackTrace] = useState<ErrorInfo | undefined>(undefined)
  return (
    <div className={roboto.className}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, stackTrace) => {
          setError(error)
          setStackTrace(stackTrace)
        }}
      >
        <ExampleLayout
          exampleName={pageProps.exampleName}
          examplePath={pageProps.examplePath}
          error={error}
          stackTrace={stackTrace}
        >
          <Component {...pageProps} />
        </ExampleLayout>
      </ErrorBoundary>
    </div>
  )
}
