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

const EXAMPLES: ExampleTuple[] = EXAMPLE_NAMES_AND_PATHS.map(([name, path]) => [
  name,
  path === 'huge-document'
    ? dynamic(() => import('../../examples/ts/huge-document'), {
        loading: HugeDocumentLoader,
      })
    : dynamic(() => import(`../../examples/ts/${path}`), {
        loading: ComponentLoader,
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
