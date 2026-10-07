import assert from 'assert'
import { createRequire } from 'module'
import { resolve } from 'path'

// `typescript` is a devDependency of the workspace root, so it is required
// through the root package for PnP resolution to find it.
const ts: typeof import('typescript') = createRequire(
  resolve(__dirname, '../../../package.json')
)('typescript')

// `setNodes` applies `merge` to each property value, so `PropsMerge` must
// allow returning scalars as well as objects:
// https://github.com/ianstormtaylor/slate/issues/5490
// Babel strips types when tests run, so this compiles a snippet against the
// package's source with the TypeScript dependency and asserts it
// type-checks. The compilation happens when this file is loaded.
const SNIPPET_FILE = resolve(__dirname, 'props-merge-snippet.ts')

const SNIPPET = `
import { BaseEditor, BaseText, Descendant, Editor, Transforms } from 'slate'

type Leaf = BaseText & { key: string | { value: number } }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor
    Element: { type: 'block'; children: Descendant[] }
    Text: Leaf
  }
}

declare const editor: Editor
declare const at: [number]

Transforms.setNodes(
  editor,
  { key: 'value' },
  {
    at,
    merge(prop, node) {
      if (node === 'value') {
        return node
      }
      return prop
    },
  }
)

Transforms.setNodes(
  editor,
  { key: { value: 1 } },
  {
    at,
    merge(prop, node) {
      return node
    },
  }
)
`

const compileSnippet = () => {
  const options: ts.CompilerOptions = {
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmit: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ESNext,
    types: [],
  }
  const host = ts.createCompilerHost(options)
  const readFile = host.readFile.bind(host)
  const fileExists = host.fileExists.bind(host)
  host.readFile = fileName =>
    resolve(fileName) === SNIPPET_FILE ? SNIPPET : readFile(fileName)
  host.fileExists = fileName =>
    resolve(fileName) === SNIPPET_FILE || fileExists(fileName)
  host.resolveModuleNames = (moduleNames, containingFile) =>
    moduleNames.map(moduleName =>
      moduleName === 'slate'
        ? {
            resolvedFileName: resolve(__dirname, '../src/index.ts'),
            extension: ts.Extension.Ts,
          }
        : ts.resolveModuleName(moduleName, containingFile, options, host)
            .resolvedModule
    )
  const program = ts.createProgram([SNIPPET_FILE], options, host)
  return ts
    .getPreEmitDiagnostics(program)
    .filter(d => d.file != null && resolve(d.file.fileName) === SNIPPET_FILE)
}

const DIAGNOSTICS = compileSnippet()

describe('PropsMerge', () => {
  it('allows merge to return scalar values', () => {
    assert.deepStrictEqual(
      DIAGNOSTICS.map(d =>
        ts.flattenDiagnosticMessageText(d.messageText, '\n')
      ),
      []
    )
  })
})
