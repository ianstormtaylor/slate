import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// node
import { getAllExamples } from '../api'
import {
  ComponentLoader,
  HugeDocumentLoader,
} from '../../components/ComponentLoader'

type ExampleTuple = [name: string, component: React.ComponentType, path: string]

// Dynamic imports to reduce initial bundle size
const EXAMPLES: ExampleTuple[] = [
  [
    'Android Tests',
    dynamic(() => import('../../examples/ts/android-tests'), {
      loading: ComponentLoader,
    }),
    'android-tests',
  ],
  [
    'Checklists',
    dynamic(() => import('../../examples/ts/check-lists'), {
      loading: ComponentLoader,
    }),
    'check-lists',
  ],
  [
    'Code Highlighting',
    dynamic(() => import('../../examples/ts/code-highlighting'), {
      loading: ComponentLoader,
    }),
    'code-highlighting',
  ],
  [
    'Custom Placeholder',
    dynamic(() => import('../../examples/ts/custom-placeholder'), {
      loading: ComponentLoader,
    }),
    'custom-placeholder',
  ],
  [
    'Editable Voids',
    dynamic(() => import('../../examples/ts/editable-voids'), {
      loading: ComponentLoader,
    }),
    'editable-voids',
  ],
  [
    'Embeds',
    dynamic(() => import('../../examples/ts/embeds'), {
      loading: ComponentLoader,
    }),
    'embeds',
  ],
  [
    'Forced Layout',
    dynamic(() => import('../../examples/ts/forced-layout'), {
      loading: ComponentLoader,
    }),
    'forced-layout',
  ],
  [
    'Hovering Toolbar',
    dynamic(() => import('../../examples/ts/hovering-toolbar'), {
      loading: ComponentLoader,
    }),
    'hovering-toolbar',
  ],
  [
    'Huge Document',
    dynamic(() => import('../../examples/ts/huge-document'), {
      loading: HugeDocumentLoader,
    }),
    'huge-document',
  ],
  [
    'Images',
    dynamic(() => import('../../examples/ts/images'), {
      loading: ComponentLoader,
    }),
    'images',
  ],
  [
    'Inlines',
    dynamic(() => import('../../examples/ts/inlines'), {
      loading: ComponentLoader,
    }),
    'inlines',
  ],
  [
    'Markdown Preview',
    dynamic(() => import('../../examples/ts/markdown-preview'), {
      loading: ComponentLoader,
    }),
    'markdown-preview',
  ],
  [
    'Markdown Shortcuts',
    dynamic(() => import('../../examples/ts/markdown-shortcuts'), {
      loading: ComponentLoader,
    }),
    'markdown-shortcuts',
  ],
  [
    'Mentions',
    dynamic(() => import('../../examples/ts/mentions'), {
      loading: ComponentLoader,
    }),
    'mentions',
  ],
  [
    'Paste HTML',
    dynamic(() => import('../../examples/ts/paste-html'), {
      loading: ComponentLoader,
    }),
    'paste-html',
  ],
  [
    'Plain Text',
    dynamic(() => import('../../examples/ts/plaintext'), {
      loading: ComponentLoader,
    }),
    'plaintext',
  ],
  [
    'Read-only',
    dynamic(() => import('../../examples/ts/read-only'), {
      loading: ComponentLoader,
    }),
    'read-only',
  ],
  [
    'Rendering in iframes',
    dynamic(() => import('../../examples/ts/iframe'), {
      loading: ComponentLoader,
    }),
    'iframe',
  ],
  [
    'Rich Text',
    dynamic(() => import('../../examples/ts/richtext'), {
      loading: ComponentLoader,
    }),
    'richtext',
  ],
  [
    'Search Highlighting',
    dynamic(() => import('../../examples/ts/search-highlighting'), {
      loading: ComponentLoader,
    }),
    'search-highlighting',
  ],
  [
    'Shadow DOM',
    dynamic(() => import('../../examples/ts/shadow-dom'), {
      loading: ComponentLoader,
    }),
    'shadow-dom',
  ],
  [
    'Styling',
    dynamic(() => import('../../examples/ts/styling'), {
      loading: ComponentLoader,
    }),
    'styling',
  ],
  [
    'Tables',
    dynamic(() => import('../../examples/ts/tables'), {
      loading: ComponentLoader,
    }),
    'tables',
  ],
]

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
  const [name, , path] = EXAMPLE || [params.example, null, params.example]
  return {
    props: {
      example: params.example,
      exampleName: name,
      examplePath: path,
    },
  }
}

export default NoSsrExamplePage
