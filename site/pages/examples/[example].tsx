import dynamic from 'next/dynamic'
import Head from 'next/head'
import type React from 'react'
import {
  ComponentLoader,
  HugeDocumentLoader,
} from '../../components/ComponentLoader'
import { EXAMPLE_NAMES_AND_PATHS } from '../../constants/examples'
// node
import { getAllExamples } from '../api'

type ExampleTuple = [name: string, component: React.ComponentType, path: string]

const EXAMPLE_IMPORTERS: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
  'android-tests': () => import('../../examples/ts/android-tests'),
  'check-lists': () => import('../../examples/ts/check-lists'),
  'code-highlighting': () => import('../../examples/ts/code-highlighting'),
  'custom-placeholder': () => import('../../examples/ts/custom-placeholder'),
  'editable-voids': () => import('../../examples/ts/editable-voids'),
  embeds: () => import('../../examples/ts/embeds'),
  'forced-layout': () => import('../../examples/ts/forced-layout'),
  'hovering-toolbar': () => import('../../examples/ts/hovering-toolbar'),
  'huge-document': () => import('../../examples/ts/huge-document'),
  images: () => import('../../examples/ts/images'),
  inlines: () => import('../../examples/ts/inlines'),
  'markdown-preview': () => import('../../examples/ts/markdown-preview'),
  'markdown-shortcuts': () => import('../../examples/ts/markdown-shortcuts'),
  mentions: () => import('../../examples/ts/mentions'),
  'paste-html': () => import('../../examples/ts/paste-html'),
  plaintext: () => import('../../examples/ts/plaintext'),
  'read-only': () => import('../../examples/ts/read-only'),
  iframe: () => import('../../examples/ts/iframe'),
  richtext: () => import('../../examples/ts/richtext'),
  'search-highlighting': () => import('../../examples/ts/search-highlighting'),
  'shadow-dom': () => import('../../examples/ts/shadow-dom'),
  styling: () => import('../../examples/ts/styling'),
  tables: () => import('../../examples/ts/tables'),
}

const EXAMPLES: ExampleTuple[] = EXAMPLE_NAMES_AND_PATHS.map(([name, path]) => [
  name,
  dynamic(EXAMPLE_IMPORTERS[path], {
    loading: path === 'huge-document' ? HugeDocumentLoader : ComponentLoader,
  }),
  path,
])

const ExamplePage = ({ example }: { example: string }) => {
  const EXAMPLE = EXAMPLES.find((e) => e[2] === example)
  const [name, Component] = EXAMPLE!

  return (
    <>
      <Head>
        <title>Slate Examples - {name}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
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
    paths: paths.map((path) => ({
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
  const EXAMPLE = EXAMPLES.find((e) => e[2] === params.example)
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
