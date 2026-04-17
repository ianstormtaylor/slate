import { afterEach, mock as bunMock, expect, mock, spyOn } from 'bun:test'
import { dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TextEncoder } from 'node:util'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import React from 'react'

const legacyClassicJsxTranspiler = new Bun.Transpiler({
  loader: 'tsx',
  tsconfig: {
    compilerOptions: {
      jsxFactory: 'jsx',
      jsx: 'react',
    },
  },
})
const legacyClassicJsxFixtureRe =
  /[/\\]packages[/\\](slate|slate-history|slate-hyperscript)[/\\]test[/\\](?!bun[/\\])(?!.*\.spec\.).+\.(js|jsx|ts|tsx)$/

const hasLocalJsxFactoryRe =
  /\b(?:const|let|var|function)\s+jsx\b|\bimport\s*\{\s*jsx\s*\}\s*from\b/
const slateTestJsxRuntimePath = fileURLToPath(
  new URL('./slate-test-jsx.js', import.meta.url)
)
const getInjectedJsxImport = (path: string) => {
  const relativePath = relative(
    dirname(path),
    slateTestJsxRuntimePath
  ).replaceAll('\\', '/')
  const specifier = relativePath.startsWith('.')
    ? relativePath
    : `./${relativePath}`

  return `import { jsx } from '${specifier}'\n`
}
const importWorkspaceModule = (specifier: string) => import(specifier)

Bun.plugin({
  name: 'legacy-hsx-fixtures',
  setup(build) {
    build.onLoad({ filter: legacyClassicJsxFixtureRe }, async (args) => {
      const source = await Bun.file(args.path).text()

      return {
        contents: legacyClassicJsxTranspiler.transformSync(
          hasLocalJsxFactoryRe.test(source)
            ? source
            : `${getInjectedJsxImport(args.path)}${source}`
        ),
        loader: 'js',
      }
    })
  },
})

bunMock.module('slate', () =>
  importWorkspaceModule('../packages/slate/src/index')
)
bunMock.module('slate-dom', () =>
  importWorkspaceModule('../packages/slate-dom/src/index')
)
bunMock.module('slate-history', () =>
  importWorkspaceModule('../packages/slate-history/src/index')
)
bunMock.module('slate-hyperscript', () =>
  importWorkspaceModule('../packages/slate-hyperscript/src/index')
)
bunMock.module('slate-react', () =>
  importWorkspaceModule('../packages/slate-react/src/index')
)

GlobalRegistrator.register({
  settings: {
    disableIframePageLoading: true,
    disableJavaScriptFileLoading: true,
    handleDisabledFileLoadingAsSuccess: true,
  },
})

if (globalThis.document && !globalThis.document.doctype) {
  const doctype = globalThis.document.implementation.createDocumentType(
    'html',
    '',
    ''
  )

  globalThis.document.insertBefore(doctype, globalThis.document.documentElement)
}

if (globalThis.document?.compatMode !== 'CSS1Compat') {
  Object.defineProperty(globalThis.document, 'compatMode', {
    configurable: true,
    value: 'CSS1Compat',
  })
}

if (globalThis.document && !globalThis.document.body) {
  const body = globalThis.document.createElement('body')
  globalThis.document.documentElement.appendChild(body)
}

if (typeof window !== 'undefined' && window.DOMParser) {
  Object.defineProperty(globalThis, 'DOMParser', {
    configurable: true,
    value: window.DOMParser,
    writable: true,
  })
}

if (typeof window !== 'undefined' && window.HTMLElement) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    window.HTMLElement.prototype,
    'isContentEditable'
  )

  Object.defineProperty(window.HTMLElement.prototype, 'isContentEditable', {
    configurable: true,
    enumerable: true,
    get() {
      const customValue = (this as { _customIsContentEditable?: boolean })
        ._customIsContentEditable

      if (customValue !== undefined) {
        return customValue
      }

      return originalDescriptor?.get?.call(this) ?? false
    },
    set(value: boolean) {
      ;(
        this as { _customIsContentEditable?: boolean }
      )._customIsContentEditable = value
    },
  })
}

expect.extend(matchers)

Object.defineProperty(globalThis, 'React', {
  configurable: true,
  value: React,
  writable: true,
})

globalThis.jest = {
  fn: mock,
  spyOn,
} as unknown as typeof jest

globalThis.mock = mock
globalThis.spyOn = spyOn

afterEach(() => {
  cleanup()
})

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder

globalThis.MessageChannel = class MessageChannel {
  port1 = {
    addEventListener: () => {},
    close: () => {},
    postMessage: () => {},
    removeEventListener: () => {},
    start: () => {},
  }
  port2 = {
    addEventListener: () => {},
    close: () => {},
    postMessage: () => {},
    removeEventListener: () => {},
    start: () => {},
  }
} as unknown as typeof globalThis.MessageChannel
