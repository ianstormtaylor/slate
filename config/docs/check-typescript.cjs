const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const blocks = file =>
  Array.from(
    fs.readFileSync(file, 'utf8').matchAll(/```(\w+)\n([\s\S]*?)```/g),
    ([, language, code]) => ({ language, code })
  )
const install = blocks('docs/walkthroughs/01-installing-slate.md')
const concepts = blocks('docs/concepts/12-typescript.md')
const commands = blocks('docs/walkthroughs/05-executing-commands.md')
const saving = blocks('docs/walkthroughs/06-saving-to-a-database.md')
const collaboration = blocks(
  'docs/walkthroughs/07-enabling-collaborative-editing.md'
)
const schema = `
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
type CustomText = { text: string; bold?: boolean }
type CustomElement = { type: 'paragraph' | 'code'; children: CustomText[] }
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
`
const commandContext = `
import React, { useCallback, useState } from 'react'
import { createEditor, Descendant, Editor, Element, Transforms } from 'slate'
import { Editable, Slate, withReact, RenderElementProps, RenderLeafProps } from 'slate-react'
declare const CodeElement: (props: RenderElementProps) => React.JSX.Element
declare const DefaultElement: (props: RenderElementProps) => React.JSX.Element
declare const Leaf: (props: RenderLeafProps) => React.JSX.Element
`
const cases = [
  [
    'installation',
    [
      install.find(block => block.code.includes('import React,')).code,
      install.find(block => block.code.includes("declare module 'slate'")).code,
      install.filter(block => ['jsx', 'tsx'].includes(block.language)).at(-1)
        .code,
    ].join('\n'),
  ],
  [
    'typescript-concepts',
    [
      concepts.find(block => block.code.includes("declare module 'slate'"))
        .code,
      concepts.find(block => block.language === 'tsx').code,
    ].join('\n'),
  ],
  ['commands', schema + commandContext + commands.at(-1).code],
  ['resetting-content', schema + saving.at(-1).code],
  ['collaboration-initial-value', schema + collaboration[0].code],
]
const options = {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  jsx: ts.JsxEmit.React,
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  types: ['react', 'react-dom'],
}
let failed = 0
for (const [name, source] of cases) {
  const file = path.resolve(`config/docs/${name}.tsx`)
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (fileName, ...args) =>
    fileName === file
      ? ts.createSourceFile(
          fileName,
          source,
          options.target,
          true,
          ts.ScriptKind.TSX
        )
      : getSourceFile(fileName, ...args)
  const program = ts.createProgram([file], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  if (diagnostics.length) {
    failed += 1
    console.error(`${name}: FAILED`)
    console.error(
      ts.formatDiagnostics(diagnostics, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: file => file,
        getNewLine: () => '\n',
      })
    )
  } else {
    console.log(`${name}: passed`)
  }
}
if (failed) process.exitCode = 1
else console.log(`${cases.length} documentation checks passing`)
