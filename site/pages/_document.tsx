import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Slate is a completely customizable framework for building rich text editors. Learn how to build powerful editors with React and TypeScript."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/index.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
