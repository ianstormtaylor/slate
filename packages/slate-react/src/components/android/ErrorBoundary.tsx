import React, { PropsWithChildren } from 'react'

export class ErrorBoundary extends React.Component<
  PropsWithChildren<{}>,
  never
> {
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(error)
  }

  render() {
    return this.props.children
  }
}
