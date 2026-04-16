import { afterEach, mock as bunMock, expect, mock, spyOn } from 'bun:test'
import { TextEncoder } from 'node:util'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

const slateHyperscriptSpecTranspiler = new Bun.Transpiler({
  loader: 'tsx',
  tsconfig: {
    compilerOptions: {
      jsx: 'react',
    },
  },
})
const slateHyperscriptSpecRe =
  /[/\\]packages[/\\]slate-hyperscript[/\\]test[/\\]hyperscript\.spec\.tsx$/

Bun.plugin({
  name: 'slate-hyperscript-spec',
  setup(build) {
    build.onLoad({ filter: slateHyperscriptSpecRe }, async (args) => {
      return {
        contents: slateHyperscriptSpecTranspiler.transformSync(
          await Bun.file(args.path).text()
        ),
        loader: 'js',
      }
    })
  },
})

bunMock.module('slate', () => import('../packages/slate/src/index'))
bunMock.module('slate-dom', () => import('../packages/slate-dom/src/index'))
bunMock.module(
  'slate-history',
  () => import('../packages/slate-history/src/index')
)
bunMock.module(
  'slate-hyperscript',
  () => import('../packages/slate-hyperscript/src/index')
)
bunMock.module('slate-react', () => import('../packages/slate-react/src/index'))

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
} as typeof globalThis.MessageChannel
