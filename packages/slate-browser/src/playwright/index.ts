import { unlinkSync, writeFileSync } from 'node:fs'

import { expect, type Frame, type Locator, type Page } from '@playwright/test'

import type { PlaceholderShape } from '../browser/zero-width'
import {
  composeText,
  composeTextDirect,
  enableCompositionKeyEvents,
} from './ime'

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'
const READY_TIMEOUT_MS = 20_000

export type SelectionSnapshot = {
  anchor: { path: number[]; offset: number }
  focus: { path: number[]; offset: number }
}

export type DOMSelectionSnapshot = {
  anchorNodeText: string | null
  anchorOffset: number
  focusNodeText: string | null
  focusOffset: number
}

export type ClipboardPayloadSnapshot = {
  html: string | null
  text: string
  types: string[]
}

export type SelectionRectSnapshot = {
  x: number
  y: number
  width: number
  height: number
}

export type SelectionPoint = SelectionSnapshot['anchor']
export type RangeRefAffinity =
  | 'forward'
  | 'backward'
  | 'outward'
  | 'inward'
  | null

export type SelectionBookmark = {
  id: string
}

export type SelectionCaptureOptions = {
  affinity?: RangeRefAffinity
}

export type OffsetExpectation = number | readonly [number, number]

export type SelectionSnapshotExpectation = {
  anchor: { path: number[]; offset: OffsetExpectation }
  focus: { path: number[]; offset: OffsetExpectation }
}

export type DOMSelectionSnapshotExpectation = {
  anchorNodeText: string | null
  anchorOffset: OffsetExpectation
  focusNodeText: string | null
  focusOffset: OffsetExpectation
}

export type HtmlNormalizationOptions = {
  ignoreClasses?: boolean
  ignoreInlineStyles?: boolean
  ignoreDir?: boolean
}

export type ReadyOptions = {
  editor?: 'visible'
  placeholder?: 'visible' | 'hidden'
  selector?: string
  text?: RegExp | string
  selection?: 'settled' | SelectionSnapshot
}

export type EditorSurfaceOptions = {
  frame?: string
  scope?: string
}

export type OpenExampleOptions = {
  ready?: ReadyOptions
  surface?: EditorSurfaceOptions
}

export type EditorSnapshot = {
  text: string
  blockTexts: string[]
  selectedText: string
  selection: SelectionSnapshot | null
  domSelection: DOMSelectionSnapshot | null
  placeholderShape: PlaceholderShape | null
}

const CLIPBOARD_LOCK_PATH = `${process.cwd()}/.slate-browser-clipboard.lock`
const SLATE_BROWSER_HANDLE_KEY = '__slateBrowserHandle'

type SurfaceTarget = Page | Frame

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

const parseSyntheticShortcut = (shortcut: string) => {
  const parts = shortcut.split('+')
  const key = parts.at(-1)

  if (!key) {
    return null
  }

  const isMac = process.platform === 'darwin'
  const modifiers = new Set(parts.slice(0, -1))

  if (
    !modifiers.has('ControlOrMeta') &&
    !modifiers.has('Alt') &&
    !modifiers.has('Shift')
  ) {
    return null
  }

  if (
    shortcut === 'ControlOrMeta+C' ||
    shortcut === 'ControlOrMeta+V' ||
    shortcut === 'ControlOrMeta+A'
  ) {
    return null
  }

  return {
    altKey: modifiers.has('Alt'),
    ctrlKey:
      modifiers.has('Control') || (!isMac && modifiers.has('ControlOrMeta')),
    key,
    metaKey: modifiers.has('Meta') || (isMac && modifiers.has('ControlOrMeta')),
    shiftKey: modifiers.has('Shift'),
  }
}

export const withExclusiveClipboardAccess = async <T>(
  work: () => Promise<T> | T
) => {
  let acquired = false

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      writeFileSync(CLIPBOARD_LOCK_PATH, String(process.pid), {
        flag: 'wx',
      })
      acquired = true
      break
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error
      }

      await sleep(50)
    }
  }

  if (!acquired) {
    throw new Error('Timed out waiting for exclusive clipboard access')
  }

  try {
    return await work()
  } finally {
    try {
      unlinkSync(CLIPBOARD_LOCK_PATH)
    } catch {
      // Ignore lock cleanup races on process shutdown.
    }
  }
}

const writeClipboardText = async (surface: SurfaceTarget, text: string) => {
  await surface.evaluate(async (value) => {
    await navigator.clipboard.writeText(value)
  }, text)
}

const writeClipboardHtml = async (
  surface: SurfaceTarget,
  html: string,
  text: string
) => {
  await surface.evaluate(
    async ({ html: nextHtml, text: nextText }) => {
      const item = new ClipboardItem({
        'text/html': new Blob([nextHtml], { type: 'text/html' }),
        'text/plain': new Blob([nextText], { type: 'text/plain' }),
      })

      await navigator.clipboard.write([item])
    },
    { html, text }
  )
}

const toPlainText = async (surface: SurfaceTarget, html: string) =>
  surface.evaluate((markup) => {
    const container = document.createElement('div')
    container.innerHTML = markup
    return container.textContent ?? ''
  }, html)

const getBlockTexts = async (root: Locator): Promise<string[]> =>
  root.evaluate((element: HTMLElement) =>
    Array.from(
      element.querySelectorAll(':scope > [data-slate-node="element"]')
    ).map((block) => (block.textContent ?? '').replace(/\uFEFF/g, ''))
  )

const getSelectedText = async (root: Locator): Promise<string> =>
  root.evaluate((element: HTMLElement) =>
    (element.ownerDocument.getSelection()?.toString() ?? '').replace(
      /\uFEFF/g,
      ''
    )
  )

const readClipboardText = async (surface: SurfaceTarget) =>
  surface.evaluate(async () => navigator.clipboard.readText())

const readClipboardHtml = async (surface: SurfaceTarget) =>
  surface.evaluate(async () => {
    const contents = await navigator.clipboard.read()

    for (const item of contents) {
      if (item.types.includes('text/html')) {
        const blob = await item.getType('text/html')
        return blob.text()
      }
    }

    return null
  })

const normalizeHtml = async (
  root: Locator,
  markup: string,
  {
    ignoreClasses = false,
    ignoreInlineStyles = false,
    ignoreDir = false,
  }: HtmlNormalizationOptions = {}
): Promise<string> =>
  root.evaluate(
    (element: HTMLElement, { nextMarkup, options }) => {
      const container = element.ownerDocument.createElement('div')
      container.innerHTML = nextMarkup

      for (const element of Array.from(container.querySelectorAll('*'))) {
        if (options.ignoreClasses) {
          element.removeAttribute('class')
        }
        if (options.ignoreInlineStyles) {
          element.removeAttribute('style')
        }
        if (options.ignoreDir) {
          element.removeAttribute('dir')
        }
      }

      return container.innerHTML
    },
    {
      nextMarkup: markup,
      options: {
        ignoreClasses,
        ignoreInlineStyles,
        ignoreDir,
      },
    }
  )

const getEditable = (
  surface: SurfaceTarget,
  options: EditorSurfaceOptions = {}
) => {
  const scopeSelector = options.scope ?? (options.frame ? 'body' : undefined)
  const scope = scopeSelector ? surface.locator(scopeSelector) : surface

  return scope.getByRole('textbox')
}

const locateBlock = (root: Locator, path: number[]) => {
  if (path.length === 0) {
    throw new Error('Block path cannot be empty')
  }

  let locator = root
    .locator(':scope > [data-slate-node="element"]')
    .nth(path[0]!)

  for (const segment of path.slice(1)) {
    locator = locator
      .locator(':scope > [data-slate-node="element"]')
      .nth(segment)
  }

  return locator
}

const locateText = (root: Locator, path: number[]) => {
  if (path.length === 0) {
    throw new Error('Text path cannot be empty')
  }

  const textIndex = path.at(-1)!
  const parentPath = path.slice(0, -1)
  const parent = parentPath.length > 0 ? locateBlock(root, parentPath) : root

  return parent.locator('[data-slate-node="text"]').nth(textIndex)
}

const captureSelectionBookmark = async (
  root: Locator,
  options: SelectionCaptureOptions = {}
): Promise<SelectionBookmark> =>
  root.evaluate(
    (
      element: HTMLElement,
      { key, affinity }: { key: string; affinity: RangeRefAffinity | undefined }
    ) => {
      const handle = (element as Record<string, any>)[key]

      if (!handle) {
        throw new Error(
          'This editor surface does not expose a Slate browser handle'
        )
      }

      const selection = handle.getSelection()

      if (!selection) {
        throw new Error('Cannot capture a bookmark without an editor selection')
      }

      return {
        id: handle.createRangeRef(selection, affinity ?? 'inward'),
      }
    },
    {
      key: SLATE_BROWSER_HANDLE_KEY,
      affinity: options.affinity,
    }
  )

const resolveSelectionBookmark = async (
  root: Locator,
  bookmark: SelectionBookmark
): Promise<SelectionSnapshot | null> =>
  root.evaluate(
    (element: HTMLElement, { key, id }: { key: string; id: string }) => {
      const handle = (element as Record<string, any>)[key]

      if (!handle) {
        throw new Error(
          'This editor surface does not expose a Slate browser handle'
        )
      }

      return handle.resolveRangeRef(id)
    },
    {
      key: SLATE_BROWSER_HANDLE_KEY,
      id: bookmark.id,
    }
  )

const restoreSelectionBookmark = async (
  root: Locator,
  bookmark: SelectionBookmark
) => {
  await root.evaluate(
    (element: HTMLElement, { key, id }: { key: string; id: string }) => {
      const handle = (element as Record<string, any>)[key]

      if (!handle) {
        throw new Error(
          'This editor surface does not expose a Slate browser handle'
        )
      }

      const range = handle.resolveRangeRef(id)

      if (!range) {
        throw new Error('Cannot restore a cleared bookmark')
      }

      handle.selectRange(range)
    },
    {
      key: SLATE_BROWSER_HANDLE_KEY,
      id: bookmark.id,
    }
  )
}

const unrefSelectionBookmark = async (
  root: Locator,
  bookmark: SelectionBookmark
): Promise<SelectionSnapshot | null> =>
  root.evaluate(
    (element: HTMLElement, { key, id }: { key: string; id: string }) => {
      const handle = (element as Record<string, any>)[key]

      if (!handle) {
        throw new Error(
          'This editor surface does not expose a Slate browser handle'
        )
      }

      return handle.unrefRangeRef(id)
    },
    {
      key: SLATE_BROWSER_HANDLE_KEY,
      id: bookmark.id,
    }
  )

const waitForHandleSelection = async (
  root: Locator,
  expected: SelectionSnapshot
) => {
  await expect
    .poll(async () =>
      root.evaluate(
        (
          element: HTMLElement,
          { key, selection }: { key: string; selection: SelectionSnapshot }
        ) => {
          const handle = (element as Record<string, any>)[key]

          if (!handle) {
            return true
          }

          const current = handle.getSelection()

          if (!current) {
            return false
          }

          const samePath = (left: number[], right: number[]) =>
            left.length === right.length &&
            left.every((segment, index) => segment === right[index])

          return (
            samePath(current.anchor.path, selection.anchor.path) &&
            samePath(current.focus.path, selection.focus.path) &&
            current.anchor.offset === selection.anchor.offset &&
            current.focus.offset === selection.focus.offset
          )
        },
        {
          key: SLATE_BROWSER_HANDLE_KEY,
          selection: expected,
        }
      )
    )
    .toBe(true)
}

const matchesOffsetExpectation = (
  expected: OffsetExpectation,
  actual: number
): boolean => {
  if (Array.isArray(expected)) {
    return actual >= expected[0] && actual <= expected[1]
  }

  return actual === expected
}

const matchesSelectionExpectation = (
  actual: SelectionSnapshot | null,
  expected: SelectionSnapshotExpectation
): boolean => {
  if (!actual) {
    return false
  }

  const pathsEqual =
    actual.anchor.path.length === expected.anchor.path.length &&
    actual.focus.path.length === expected.focus.path.length &&
    actual.anchor.path.every(
      (segment, index) => segment === expected.anchor.path[index]
    ) &&
    actual.focus.path.every(
      (segment, index) => segment === expected.focus.path[index]
    )

  return (
    pathsEqual &&
    matchesOffsetExpectation(expected.anchor.offset, actual.anchor.offset) &&
    matchesOffsetExpectation(expected.focus.offset, actual.focus.offset)
  )
}

const matchesDOMSelectionExpectation = (
  actual: DOMSelectionSnapshot | null,
  expected: DOMSelectionSnapshotExpectation
): boolean => {
  if (!actual) {
    return false
  }

  return (
    actual.anchorNodeText === expected.anchorNodeText &&
    actual.focusNodeText === expected.focusNodeText &&
    matchesOffsetExpectation(expected.anchorOffset, actual.anchorOffset) &&
    matchesOffsetExpectation(expected.focusOffset, actual.focusOffset)
  )
}

const assertSelectionExpectation = async (
  root: Locator,
  expected: SelectionSnapshotExpectation
) => {
  let actual: SelectionSnapshot | null = null

  try {
    await expect
      .poll(async () => {
        actual = await takeSelectionSnapshotForRoot(root)
        return matchesSelectionExpectation(actual, expected)
      })
      .toBe(true)
  } catch {
    throw new Error(
      `Expected Slate selection ${JSON.stringify(
        expected
      )} but received ${JSON.stringify(actual)}`
    )
  }
}

const assertDOMSelectionExpectation = async (
  root: Locator,
  expected: DOMSelectionSnapshotExpectation
) => {
  let actual: DOMSelectionSnapshot | null = null

  try {
    await expect
      .poll(async () => {
        actual = await takeDOMSelectionSnapshotForRoot(root)
        return matchesDOMSelectionExpectation(actual, expected)
      })
      .toBe(true)
  } catch {
    throw new Error(
      `Expected DOM selection ${JSON.stringify(
        expected
      )} but received ${JSON.stringify(actual)}`
    )
  }
}

export type SlateBrowserEditorHarness = {
  name: string
  page: Page
  root: Locator
  get: {
    text: () => Promise<string>
    blockTexts: () => Promise<string[]>
    selectedText: () => Promise<string>
    html: () => Promise<string>
    selection: () => Promise<SelectionSnapshot | null>
    domSelection: () => Promise<DOMSelectionSnapshot | null>
    placeholderShape: (selector?: string) => Promise<PlaceholderShape | null>
  }
  selection: {
    select: (selection: SelectionSnapshot) => Promise<void>
    collapse: (point: SelectionPoint) => Promise<void>
    capture: (options?: SelectionCaptureOptions) => Promise<SelectionBookmark>
    bookmark: (options?: SelectionCaptureOptions) => Promise<SelectionBookmark>
    resolve: (bookmark: SelectionBookmark) => Promise<SelectionSnapshot | null>
    restore: (bookmark: SelectionBookmark) => Promise<void>
    unref: (bookmark: SelectionBookmark) => Promise<SelectionSnapshot | null>
    selectAll: () => Promise<void>
    get: () => Promise<SelectionSnapshot | null>
    dom: () => Promise<DOMSelectionSnapshot | null>
    rect: () => Promise<SelectionRectSnapshot | null>
  }
  locator: {
    block: (path: number[]) => Locator
    text: (path: number[]) => Locator
  }
  ready: (options: ReadyOptions) => Promise<void>
  snapshot: () => Promise<EditorSnapshot>
  focus: () => Promise<void>
  click: () => Promise<void>
  type: (text: string) => Promise<void>
  press: (key: string) => Promise<void>
  selectAll: () => Promise<void>
  assert: {
    text: (text: string) => Promise<void>
    blockTexts: (texts: string[]) => Promise<void>
    html: (expectedFragment: string) => Promise<void>
    htmlContains: (expectedFragment: string) => Promise<void>
    htmlEquals: (
      expectedHtml: string,
      options?: HtmlNormalizationOptions
    ) => Promise<void>
    selection: (expected: SelectionSnapshotExpectation) => Promise<void>
    domSelection: (expected: DOMSelectionSnapshotExpectation) => Promise<void>
    placeholderShape: (
      expected: PlaceholderShape,
      selector?: string
    ) => Promise<void>
    placeholderVisible: (visible?: boolean) => Promise<void>
  }
  clipboard: {
    copy: () => Promise<void>
    copyPayload: () => Promise<ClipboardPayloadSnapshot>
    readText: () => Promise<string>
    readHtml: () => Promise<string | null>
    pasteText: (text: string) => Promise<void>
    pasteHtml: (html: string, plainText?: string) => Promise<void>
    assert: {
      textContains: (expected: string) => Promise<void>
      htmlContains: (expected: string) => Promise<void>
      htmlEquals: (expected: string) => Promise<void>
      types: (expected: string[]) => Promise<void>
    }
  }
  ime: {
    enableKeyEvents: () => Promise<void>
    compose: (options: {
      text: string
      steps?: readonly string[]
      committedText?: string
    }) => Promise<void>
    composeDirect: (options: { text: string }) => Promise<void>
  }
  withExtension: <T>(extend: (editor: SlateBrowserEditorHarness) => T) => T
}

const getSelectionRect = async (
  root: Locator
): Promise<SelectionRectSnapshot | null> =>
  root.evaluate((element: HTMLElement) => {
    const selection = element.ownerDocument.getSelection()

    if (!selection || selection.rangeCount === 0) {
      return null
    }

    if (
      !element.contains(selection.anchorNode) ||
      !element.contains(selection.focusNode)
    ) {
      return null
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect()

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    }
  })

export const takeDOMSelectionSnapshot = async (
  page: Page
): Promise<DOMSelectionSnapshot | null> =>
  page.evaluate(() => {
    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0) {
      return null
    }

    return {
      anchorNodeText: selection.anchorNode?.textContent ?? null,
      anchorOffset: selection.anchorOffset,
      focusNodeText: selection.focusNode?.textContent ?? null,
      focusOffset: selection.focusOffset,
    }
  })

const takeDOMSelectionSnapshotForRoot = async (
  root: Locator
): Promise<DOMSelectionSnapshot | null> =>
  root.evaluate((element: HTMLElement) => {
    const selection = element.ownerDocument.getSelection()

    if (!selection || selection.rangeCount === 0) {
      return null
    }

    if (
      !element.contains(selection.anchorNode) ||
      !element.contains(selection.focusNode)
    ) {
      return null
    }

    return {
      anchorNodeText: selection.anchorNode?.textContent ?? null,
      anchorOffset: selection.anchorOffset,
      focusNodeText: selection.focusNode?.textContent ?? null,
      focusOffset: selection.focusOffset,
    }
  })

export const takeSelectionSnapshot = async (
  page: Page
): Promise<SelectionSnapshot | null> =>
  page.evaluate(
    ({ key }) => {
      const root = document.querySelector('[data-slate-editor="true"]')
      const selection = window.getSelection()

      if (!root || !selection || selection.rangeCount === 0) {
        return null
      }

      const handle = (root as Record<string, any>)[key]

      if (handle?.getSelection) {
        return handle.getSelection()
      }

      const textNodes = Array.from(
        root.querySelectorAll('[data-slate-node="text"]')
      )
      const getTextSegments = (owner: Element) =>
        Array.from(
          owner.querySelectorAll('[data-slate-string], [data-slate-zero-width]')
        ).map((segment) => {
          const leafNode = segment.firstChild
          const domLength = leafNode?.textContent?.length ?? 0
          const attr = segment.getAttribute('data-slate-length')
          const trueLength =
            attr == null ? domLength : Number.parseInt(attr, 10)

          return {
            domLength,
            segment,
            trueLength,
          }
        })
      const getNodeLength = (node: Node | null) =>
        node?.nodeType === 3
          ? (node.textContent?.length ?? 0)
          : (node?.childNodes.length ?? 0)
      const hasZeroWidthMarker = (node: Node | null) => {
        const element =
          node?.nodeType === 1 ? (node as Element) : node?.parentElement

        return !!element?.getAttribute('data-slate-zero-width')
      }
      const toEditorOffset = (node: Node | null, offset: number) => {
        const owner =
          node?.nodeType === 1
            ? (node as Element).closest('[data-slate-node="text"]')
            : node?.parentElement?.closest('[data-slate-node="text"]')
        const segment =
          node?.nodeType === 1
            ? (node as Element).closest(
                '[data-slate-string], [data-slate-zero-width]'
              )
            : node?.parentElement?.closest(
                '[data-slate-string], [data-slate-zero-width]'
              )

        const localOffset =
          hasZeroWidthMarker(node) && offset === 1 && getNodeLength(node) <= 1
            ? 0
            : offset

        if (!owner || !segment) {
          return localOffset
        }

        const segments = getTextSegments(owner)
        const segmentIndex = segments.findIndex(
          (entry) => entry.segment === segment
        )

        if (segmentIndex <= 0) {
          return localOffset
        }

        return (
          segments
            .slice(0, segmentIndex)
            .reduce((total, entry) => total + entry.trueLength, 0) + localOffset
        )
      }
      const getPath = (node: Node | null) => {
        const owner =
          node?.nodeType === 1
            ? (node as Element).closest('[data-slate-node="text"]')
            : node?.parentElement?.closest('[data-slate-node="text"]')

        if (!owner) {
          throw new Error('Cannot resolve selection to a Slate text node')
        }

        const index = textNodes.indexOf(owner)

        if (index < 0) {
          throw new Error('Selection text node is outside the editor root')
        }

        return [index, 0]
      }

      return {
        anchor: {
          path: getPath(selection.anchorNode),
          offset: toEditorOffset(selection.anchorNode, selection.anchorOffset),
        },
        focus: {
          path: getPath(selection.focusNode),
          offset: toEditorOffset(selection.focusNode, selection.focusOffset),
        },
      }
    },
    { key: SLATE_BROWSER_HANDLE_KEY }
  )

const takeSelectionSnapshotForRoot = async (
  root: Locator
): Promise<SelectionSnapshot | null> =>
  root.evaluate(
    (element: HTMLElement, { key }: { key: string }) => {
      const selection = element.ownerDocument.getSelection()

      if (!selection || selection.rangeCount === 0) {
        return null
      }

      if (
        !element.contains(selection.anchorNode) ||
        !element.contains(selection.focusNode)
      ) {
        return null
      }

      const handle = (element as Record<string, any>)[key]

      if (handle?.getSelection) {
        return handle.getSelection()
      }

      const textNodes = Array.from(
        element.querySelectorAll('[data-slate-node="text"]')
      )

      const getTextSegments = (owner: Element) =>
        Array.from(
          owner.querySelectorAll('[data-slate-string], [data-slate-zero-width]')
        ).map((segment) => {
          const leafNode = segment.firstChild
          const domLength = leafNode?.textContent?.length ?? 0
          const attr = segment.getAttribute('data-slate-length')
          const trueLength =
            attr == null ? domLength : Number.parseInt(attr, 10)

          return {
            domLength,
            segment,
            trueLength,
          }
        })

      const getNodeLength = (node: Node | null) =>
        node?.nodeType === 3
          ? (node.textContent?.length ?? 0)
          : (node?.childNodes.length ?? 0)

      const hasZeroWidthMarker = (node: Node | null) => {
        const markerElement =
          node?.nodeType === 1 ? (node as Element) : node?.parentElement

        return !!markerElement?.getAttribute('data-slate-zero-width')
      }

      const toEditorOffset = (node: Node | null, offset: number) => {
        const owner =
          node?.nodeType === 1
            ? (node as Element).closest('[data-slate-node="text"]')
            : node?.parentElement?.closest('[data-slate-node="text"]')
        const segment =
          node?.nodeType === 1
            ? (node as Element).closest(
                '[data-slate-string], [data-slate-zero-width]'
              )
            : node?.parentElement?.closest(
                '[data-slate-string], [data-slate-zero-width]'
              )

        const localOffset =
          hasZeroWidthMarker(node) && offset === 1 && getNodeLength(node) <= 1
            ? 0
            : offset

        if (!owner || !segment) {
          return localOffset
        }

        const segments = getTextSegments(owner)
        const segmentIndex = segments.findIndex(
          (entry) => entry.segment === segment
        )

        if (segmentIndex <= 0) {
          return localOffset
        }

        return (
          segments
            .slice(0, segmentIndex)
            .reduce((total, entry) => total + entry.trueLength, 0) + localOffset
        )
      }

      const getPath = (node: Node | null) => {
        const owner =
          node?.nodeType === 1
            ? (node as Element).closest('[data-slate-node="text"]')
            : node?.parentElement?.closest('[data-slate-node="text"]')

        if (!owner) {
          throw new Error('Cannot resolve selection to a Slate text node')
        }

        const index = textNodes.indexOf(owner)

        if (index < 0) {
          throw new Error('Selection text node is outside the editor root')
        }

        return [index, 0]
      }

      return {
        anchor: {
          path: getPath(selection.anchorNode),
          offset: toEditorOffset(selection.anchorNode, selection.anchorOffset),
        },
        focus: {
          path: getPath(selection.focusNode),
          offset: toEditorOffset(selection.focusNode, selection.focusOffset),
        },
      }
    },
    { key: SLATE_BROWSER_HANDLE_KEY }
  )

const waitForSelectionSync = async (root: Locator) => {
  await expect
    .poll(() =>
      root.evaluate((element: HTMLElement) => {
        const selected = element.ownerDocument.getSelection()?.toString() ?? ''
        const editorText = Array.from(
          element.querySelectorAll(
            '[data-slate-string="true"], [data-slate-zero-width]'
          )
        )
          .map((node) => node.textContent ?? '')
          .join('')
          .replace(/\uFEFF/g, '')
          .trim()

        return selected.length > 0 || editorText.length === 0
      })
    )
    .toBe(true)
  await root.page().waitForTimeout(100)
}

const hasSelectionHandle = async (root: Locator) =>
  root
    .evaluate(
      (element: HTMLElement, { key }: { key: string }) =>
        !!(element as Record<string, any>)[key]?.selectRange,
      { key: SLATE_BROWSER_HANDLE_KEY }
    )
    .catch(() => false)

const waitForSelectionHandle = async (root: Locator, timeout = 2000) => {
  try {
    await root.waitFor()
    await expect.poll(() => hasSelectionHandle(root), { timeout }).toBe(true)
    return true
  } catch {
    return false
  }
}

const waitForSelectionRange = async (root: Locator) => {
  await expect
    .poll(() =>
      root.evaluate(
        (element: HTMLElement) =>
          (element.ownerDocument.getSelection()?.rangeCount ?? 0) > 0
      )
    )
    .toBe(true)
  await root.page().waitForTimeout(100)
}

const waitForSelectionIfPresent = async (root: Locator) => {
  const hasSelection = await root.evaluate(
    (element: HTMLElement) =>
      (element.ownerDocument.getSelection()?.rangeCount ?? 0) > 0
  )

  if (!hasSelection) {
    return
  }

  await waitForSelectionSync(root)
}

const setSelectionWithHandle = async (
  root: Locator,
  selection: SelectionSnapshot
) =>
  root.evaluate(
    (
      element: HTMLElement,
      { key, nextSelection }: { key: string; nextSelection: SelectionSnapshot }
    ) => {
      const handle = (element as Record<string, any>)[key]

      if (!handle?.selectRange) {
        return false
      }

      handle.selectRange(nextSelection)
      return true
    },
    {
      key: SLATE_BROWSER_HANDLE_KEY,
      nextSelection: selection,
    }
  )

const setSelection = async (root: Locator, selection: SelectionSnapshot) => {
  await root.evaluate((element: HTMLElement, expected) => {
    const textNodes = Array.from(
      element.querySelectorAll('[data-slate-node="text"]')
    )

    const comparePoint = (
      left: SelectionPoint,
      right: SelectionPoint
    ): number => {
      const count = Math.max(left.path.length, right.path.length)

      for (let index = 0; index < count; index += 1) {
        const leftSegment = left.path[index] ?? -1
        const rightSegment = right.path[index] ?? -1

        if (leftSegment !== rightSegment) {
          return leftSegment - rightSegment
        }
      }

      return left.offset - right.offset
    }

    const getTextLeaf = (owner: Element) => {
      const walker = document.createTreeWalker(owner, NodeFilter.SHOW_TEXT)
      return walker.nextNode()
    }

    const resolvePoint = (point: SelectionPoint) => {
      if (point.path.length === 0) {
        throw new Error('Cannot resolve an empty Slate path')
      }

      const owner = textNodes[point.path[0]]

      if (!owner) {
        throw new Error(`Cannot resolve Slate path ${point.path.join('.')}`)
      }

      const zeroWidthOwner = owner.querySelector('[data-slate-zero-width]')

      if (zeroWidthOwner && point.offset === 0) {
        const textLeaf = getTextLeaf(owner)

        if (textLeaf && (textLeaf.textContent?.length ?? 0) <= 1) {
          return { node: textLeaf, offset: 1 }
        }
      }

      let remaining = point.offset
      const walker = document.createTreeWalker(owner, NodeFilter.SHOW_TEXT)
      let current = walker.nextNode()
      let lastTextNode: Node | null = null

      while (current) {
        lastTextNode = current
        const length = current.textContent?.length ?? 0

        if (remaining <= length) {
          return { node: current, offset: remaining }
        }

        remaining -= length
        current = walker.nextNode()
      }

      if (lastTextNode) {
        return {
          node: lastTextNode,
          offset: lastTextNode.textContent?.length ?? 0,
        }
      }

      return { node: owner, offset: owner.childNodes.length }
    }

    const anchor = resolvePoint(expected.anchor)
    const focus = resolvePoint(expected.focus)
    const selection = element.ownerDocument.getSelection()

    if (!selection) {
      throw new Error('Cannot access window selection')
    }

    const isBackward = comparePoint(expected.anchor, expected.focus) > 0
    const isCollapsed = comparePoint(expected.anchor, expected.focus) === 0

    selection.removeAllRanges()

    if (isCollapsed) {
      selection.collapse(anchor.node, anchor.offset)
      return
    }

    if (isBackward && typeof selection.extend === 'function') {
      const range = element.ownerDocument.createRange()
      range.setStart(focus.node, focus.offset)
      range.setEnd(focus.node, focus.offset)
      selection.addRange(range)
      selection.extend(anchor.node, anchor.offset)
      return
    }

    const range = element.ownerDocument.createRange()
    range.setStart(anchor.node, anchor.offset)
    range.setEnd(focus.node, focus.offset)
    selection.addRange(range)
  }, selection)
}

const waitForReady = async (
  editor: SlateBrowserEditorHarness,
  surface: SurfaceTarget,
  { editor: editorState, placeholder, selector, text, selection }: ReadyOptions
) => {
  if (editorState === 'visible') {
    await expect(editor.root).toBeVisible({ timeout: READY_TIMEOUT_MS })
  }

  if (placeholder) {
    await editor.assert.placeholderVisible(placeholder === 'visible')
  }

  if (selector) {
    await surface.locator(selector).first().waitFor({
      state: 'visible',
      timeout: READY_TIMEOUT_MS,
    })
  }

  if (text) {
    if (text instanceof RegExp) {
      await expect(editor.root).toContainText(text, {
        timeout: READY_TIMEOUT_MS,
      })
    } else {
      await editor.assert.text(text)
    }
  }

  if (selection === 'settled') {
    await waitForSelectionIfPresent(editor.root)
  } else if (selection) {
    await editor.assert.selection(selection)
  }
}

const resolveSurface = async (
  page: Page,
  options: EditorSurfaceOptions = {}
): Promise<SurfaceTarget> => {
  if (!options.frame) {
    return page
  }

  const iframe = page.locator(options.frame).first()
  await iframe.waitFor()
  const handle = await iframe.elementHandle()

  if (!handle) {
    throw new Error(
      `Cannot resolve iframe handle for selector ${options.frame}`
    )
  }

  const frame = await handle.contentFrame()

  if (!frame) {
    throw new Error(
      `Cannot resolve content frame for selector ${options.frame}`
    )
  }

  return frame
}

const createEditorHarness = (
  page: Page,
  name: string,
  surface: SurfaceTarget,
  surfaceOptions: EditorSurfaceOptions = {}
): SlateBrowserEditorHarness => {
  const root = getEditable(surface, surfaceOptions)

  const harness: SlateBrowserEditorHarness = {
    name,
    page,
    root,
    get: {
      text: async () => (await root.textContent()) ?? '',
      blockTexts: async () => getBlockTexts(root),
      selectedText: async () => getSelectedText(root),
      html: async () => root.evaluate((el: HTMLElement) => el.innerHTML),
      selection: async () => takeSelectionSnapshotForRoot(root),
      domSelection: async () => takeDOMSelectionSnapshotForRoot(root),
      placeholderShape: async (selector = '[data-slate-zero-width]') => {
        const count = await root.locator(selector).count()

        if (count === 0) {
          return null
        }

        return root
          .locator(selector)
          .first()
          .evaluate((element: Element) => ({
            hasBr: !!element.querySelector('br'),
            hasFEFF: element.textContent?.includes('\uFEFF') ?? false,
            kind: element.getAttribute('data-slate-zero-width'),
          }))
      },
    },
    selection: {
      select: async (selection: SelectionSnapshot) => {
        const selectedWithHandle =
          (await waitForSelectionHandle(root)) &&
          (await setSelectionWithHandle(root, selection))

        if (!selectedWithHandle) {
          await setSelection(root, selection)
        }

        if (selectedWithHandle) {
          await waitForHandleSelection(root, selection)
        }

        await waitForSelectionRange(root)
        await harness.assert.selection(selection)
      },
      collapse: async (point: SelectionPoint) => {
        await harness.selection.select({
          anchor: point,
          focus: point,
        })
      },
      capture: async (options?: SelectionCaptureOptions) =>
        captureSelectionBookmark(root, options),
      bookmark: async (options?: SelectionCaptureOptions) =>
        captureSelectionBookmark(root, options),
      resolve: async (bookmark: SelectionBookmark) =>
        resolveSelectionBookmark(root, bookmark),
      restore: async (bookmark: SelectionBookmark) => {
        await restoreSelectionBookmark(root, bookmark)
        await waitForSelectionIfPresent(root)
      },
      unref: async (bookmark: SelectionBookmark) =>
        unrefSelectionBookmark(root, bookmark),
      selectAll: async () => {
        await harness.focus()
        await page.keyboard.press('ControlOrMeta+A')
        await waitForSelectionSync(root)
      },
      get: async () => takeSelectionSnapshotForRoot(root),
      dom: async () => takeDOMSelectionSnapshotForRoot(root),
      rect: async () => getSelectionRect(root),
    },
    locator: {
      block: (path: number[]) => locateBlock(root, path),
      text: (path: number[]) => locateText(root, path),
    },
    ready: async (options: ReadyOptions) => {
      await waitForReady(harness, surface, options)
    },
    snapshot: async () => ({
      text: await harness.get.text(),
      blockTexts: await harness.get.blockTexts(),
      selectedText: await harness.get.selectedText(),
      selection: await harness.get.selection(),
      domSelection: await harness.get.domSelection(),
      placeholderShape: await harness.get.placeholderShape(),
    }),
    focus: async () => {
      await root.evaluate((element: HTMLElement) => {
        element.focus()
      })
      await waitForSelectionRange(root)
      await root.page().waitForTimeout(50)
      const selection = await root.evaluate(
        (element: HTMLElement, { key }: { key: string }) => {
          const handle = (element as Record<string, any>)[key]
          return handle?.getSelection ? handle.getSelection() : null
        },
        { key: SLATE_BROWSER_HANDLE_KEY }
      )

      if (selection) {
        await harness.selection.select(selection)
        return
      }

      await waitForSelectionRange(root)
    },
    click: async () => {
      await root.click()
    },
    type: async (text: string) => {
      await harness.focus()
      await page.keyboard.type(text)
    },
    press: async (key: string) => {
      await harness.focus()

      const syntheticShortcut = parseSyntheticShortcut(key)

      if (syntheticShortcut) {
        await root.evaluate(
          (element: HTMLElement, eventInit: KeyboardEventInit) => {
            const createEvent = () =>
              new KeyboardEvent('keydown', {
                altKey: eventInit.altKey,
                bubbles: true,
                cancelable: true,
                ctrlKey: eventInit.ctrlKey,
                key: eventInit.key,
                metaKey: eventInit.metaKey,
                shiftKey: eventInit.shiftKey,
              })
            element.dispatchEvent(createEvent())
            element.dispatchEvent(
              new KeyboardEvent('keyup', {
                altKey: eventInit.altKey,
                bubbles: true,
                cancelable: true,
                ctrlKey: eventInit.ctrlKey,
                key: eventInit.key,
                metaKey: eventInit.metaKey,
                shiftKey: eventInit.shiftKey,
              })
            )
          },
          syntheticShortcut
        )
        await page.waitForTimeout(0)
        return
      }

      await page.keyboard.press(key)
    },
    selectAll: async () => {
      await harness.selection.selectAll()
    },
    assert: {
      text: async (text: string) => {
        await expect(root).toContainText(text)
      },
      blockTexts: async (texts: string[]) => {
        await expect.poll(() => getBlockTexts(root)).toEqual(texts)
      },
      html: async (expectedFragment: string) => {
        await harness.assert.htmlContains(expectedFragment)
      },
      htmlContains: async (expectedFragment: string) => {
        await expect
          .poll(() => root.evaluate((el: HTMLElement) => el.innerHTML))
          .toContain(expectedFragment)
      },
      htmlEquals: async (
        expectedHtml: string,
        options: HtmlNormalizationOptions = {}
      ) => {
        await expect
          .poll(async () => {
            const actual = await root.evaluate(
              (el: HTMLElement) => el.innerHTML
            )

            return {
              actual: await normalizeHtml(root, actual, options),
              expected: await normalizeHtml(root, expectedHtml, options),
            }
          })
          .toEqual({
            actual: await normalizeHtml(root, expectedHtml, options),
            expected: await normalizeHtml(root, expectedHtml, options),
          })
      },
      selection: async (expected: SelectionSnapshotExpectation) => {
        await assertSelectionExpectation(root, expected)
      },
      domSelection: async (expected: DOMSelectionSnapshotExpectation) => {
        await assertDOMSelectionExpectation(root, expected)
      },
      placeholderShape: async (
        expected: PlaceholderShape,
        selector = '[data-slate-zero-width]'
      ) => {
        await expect
          .poll(() =>
            root
              .locator(selector)
              .first()
              .evaluate((element: Element) => ({
                hasBr: !!element.querySelector('br'),
                hasFEFF: element.textContent?.includes('\uFEFF') ?? false,
                kind: element.getAttribute('data-slate-zero-width'),
              }))
          )
          .toEqual(expected)
      },
      placeholderVisible: async (visible = true) => {
        const placeholder = root.locator('[data-slate-placeholder="true"]')

        if (visible) {
          await expect(placeholder).toBeVisible()
          return
        }

        await expect(placeholder).toHaveCount(0)
      },
    },
    clipboard: {
      copy: async () => {
        await withExclusiveClipboardAccess(async () => {
          await harness.selection.selectAll()
          await root.press('ControlOrMeta+C')
        })
      },
      readText: async () =>
        withExclusiveClipboardAccess(async () => readClipboardText(surface)),
      readHtml: async () =>
        withExclusiveClipboardAccess(async () => readClipboardHtml(surface)),
      copyPayload: async () =>
        root.evaluate((el: HTMLElement) => {
          const payload = new Map<string, string>()
          const clipboardData = {
            clearData(type?: string) {
              if (type) {
                payload.delete(type)
                return
              }

              payload.clear()
            },
            getData(type: string) {
              return payload.get(type) ?? ''
            },
            setData(type: string, value: string) {
              payload.set(type, value)
            },
            get types() {
              return Array.from(payload.keys())
            },
          }
          const event = Object.assign(
            new Event('copy', { bubbles: true, cancelable: true }),
            { clipboardData }
          )

          el.dispatchEvent(event)

          return {
            html: payload.get('text/html') ?? null,
            text: payload.get('text/plain') ?? '',
            types: Array.from(payload.keys()),
          }
        }),
      pasteText: async (text: string) => {
        await withExclusiveClipboardAccess(async () => {
          await writeClipboardText(surface, text)
          await root.press('ControlOrMeta+V')
        })
      },
      pasteHtml: async (html: string, plainText?: string) => {
        await withExclusiveClipboardAccess(async () => {
          await writeClipboardHtml(
            surface,
            html,
            plainText ?? (await toPlainText(surface, html))
          )
          await root.press('ControlOrMeta+V')
        })
      },
      assert: {
        textContains: async (expected: string) => {
          const payload = await harness.clipboard.copyPayload()
          expect(payload.text).toContain(expected)
        },
        htmlContains: async (expected: string) => {
          const payload = await harness.clipboard.copyPayload()
          expect(payload.html).toContain(expected)
        },
        htmlEquals: async (expected: string) => {
          const payload = await harness.clipboard.copyPayload()
          expect(payload.html).toBe(expected)
        },
        types: async (expected: string[]) => {
          const payload = await harness.clipboard.copyPayload()
          expect(payload.types).toEqual(expect.arrayContaining(expected))
        },
      },
    },
    ime: {
      enableKeyEvents: async () => {
        await enableCompositionKeyEvents(page)
      },
      compose: async ({ text, steps = [text], committedText = text }) => {
        await enableCompositionKeyEvents(page)
        await composeText(page, steps, committedText)
      },
      composeDirect: async ({ text }) => {
        await composeTextDirect(page, text)
      },
    },
    withExtension: <T>(extend: (editor: SlateBrowserEditorHarness) => T) =>
      extend(harness),
  }

  return harness
}

export const openExample = async (
  page: Page,
  name: string,
  options: OpenExampleOptions = {}
) => openExampleWithOptions(page, name, options)

export const openExampleWithOptions = async (
  page: Page,
  name: string,
  { ready, surface }: OpenExampleOptions
) => {
  await page.goto(`${baseUrl}/examples/${name}`)
  const resolvedSurface = await resolveSurface(page, surface)
  const editor = createEditorHarness(page, name, resolvedSurface, surface)

  const normalizedReady: ReadyOptions = ready ?? {
    editor: 'visible',
  }

  if (normalizedReady) {
    await editor.ready(normalizedReady)
  }

  return editor
}
