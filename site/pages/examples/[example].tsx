import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

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

const ExamplePage = ({ example }: { example: string }) => {
  const EXAMPLE = EXAMPLES.find(e => e[2] === example)
  const [name, Component, path] = EXAMPLE!

  return (
    <>
      <Head>
        <title>Slate Examples - {name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component />
    </>
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
  const EXAMPLE = EXAMPLES.find(e => e[2] === params.example)
  const [name, , path] = EXAMPLE!
  return {
    props: {
      example: params.example,
      exampleName: name,
      examplePath: path,
    },
  }
}

export default NoSsrExamplePage
