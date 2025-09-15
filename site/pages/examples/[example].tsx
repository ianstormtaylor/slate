import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// node
import { getAllExamples } from '../api'
import {
  ComponentLoader,
  HugeDocumentLoader,
} from '../../components/ComponentLoader'
import { EXAMPLE_NAMES_AND_PATHS } from '../../constants/examples'

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
