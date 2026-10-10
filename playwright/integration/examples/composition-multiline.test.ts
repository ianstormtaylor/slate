import { test, expect } from '@playwright/test'
import type { Point } from 'slate'
import type { HistoryEditor } from 'slate-history'
import { getEditorHandle } from '../support/editor'

type FixtureNode =
  | { text: string; bold?: boolean }
  | { type: string; url?: string; character?: string; children: FixtureNode[] }

type Fixture = {
  name: string
  example: string
  children?: FixtureNode[]
  point?: Point
  commit?: string
  mode?: 'plain' | 'replace' | 'cancel' | 'update'
}

const paragraph = (text: string): FixtureNode => ({
  type: 'paragraph',
  children: [{ text }],
})

const fixtures: Fixture[] = [
  { name: 'at a paragraph end', example: 'richtext' },
  {
    name: 'at a paragraph start',
    example: 'richtext',
    children: [paragraph('tail')],
    point: { path: [0, 0], offset: 0 },
  },
  {
    name: 'between block voids',
    example: 'images',
    children: [
      {
        type: 'image',
        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        children: [{ text: '' }],
      },
      paragraph('text'),
      {
        type: 'image',
        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        children: [{ text: '' }],
      },
    ],
    point: { path: [1, 0], offset: 2 },
  },
  {
    name: 'after an unrelated React update',
    example: 'richtext',
    mode: 'update',
  },
  {
    name: 'in the middle of a paragraph',
    example: 'richtext',
    children: [paragraph('prefix suffix')],
    point: { path: [0, 0], offset: 7 },
  },
  {
    name: 'in an empty paragraph',
    example: 'richtext',
    children: [paragraph('')],
    point: { path: [0, 0], offset: 0 },
  },
  {
    name: 'inside marked text',
    example: 'richtext',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'bold', bold: true }, { text: ' tail' }],
      },
    ],
    point: { path: [0, 0], offset: 2 },
  },
  {
    name: 'inside a list item',
    example: 'richtext',
    children: [
      {
        type: 'bulleted-list',
        children: [{ type: 'list-item', children: [{ text: 'item' }] }],
      },
      paragraph('after'),
    ],
    point: { path: [0, 0, 0], offset: 2 },
  },
  {
    name: 'inside a table cell',
    example: 'tables',
    children: [
      paragraph('before'),
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [{ text: 'cell' }] },
              { type: 'table-cell', children: [{ text: 'other' }] },
            ],
          },
        ],
      },
      paragraph('after'),
    ],
    point: { path: [1, 0, 0, 0], offset: 2 },
  },
  {
    name: 'inside an inline link',
    example: 'inlines',
    children: [
      {
        type: 'paragraph',
        children: [
          { text: 'before ' },
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ text: 'link' }],
          },
          { text: ' after' },
        ],
      },
    ],
    point: { path: [0, 1, 0], offset: 2 },
  },
  {
    name: 'beside an inline void',
    example: 'mentions',
    children: [
      {
        type: 'paragraph',
        children: [
          { text: 'before ' },
          { type: 'mention', character: 'R2-D2', children: [{ text: '' }] },
          { text: ' after' },
        ],
      },
    ],
    point: { path: [0, 2], offset: 3 },
  },
  { name: 'inside a shadow root', example: 'shadow-dom' },
  {
    name: 'with three committed lines',
    example: 'richtext',
    commit: 'AAA\nBBB\nCCC',
  },
  {
    name: 'with ordinary single-line composition',
    example: 'richtext',
    commit: '漢字',
  },
  { name: 'without composition', example: 'richtext', mode: 'plain' },
  {
    name: 'after replacing a multiline candidate',
    example: 'richtext',
    mode: 'replace',
    commit: '漢字',
  },
  {
    name: 'after cancelling a multiline candidate',
    example: 'richtext',
    mode: 'cancel',
  },
]

for (const fixture of fixtures) {
  test(`composition DOM stays in sync ${fixture.name}`, async ({
    page,
    browserName,
  }, info) => {
    test.skip(
      browserName !== 'chromium' || info.project.name === 'mobile',
      'Desktop Chromium composition regression'
    )
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`http://localhost:3000/examples/${fixture.example}`)
    const element = page.getByRole('textbox')
    await element.click()
    const editor = await getEditorHandle(element)
    const original = await editor.evaluate((editor, fixture) => {
      const { children } = fixture
      if (children) {
        editor.withoutNormalizing(() => {
          for (let i = editor.children.length - 1; i >= 0; i--)
            editor.removeNodes({ at: [i] })
          editor.insertNodes(children, { at: [0] })
        })
      }
      const point = fixture.point ?? editor.end([0])
      editor.select(point)
      return {
        prefix: editor.string({ anchor: editor.start([]), focus: point }),
        suffix: editor.string({ anchor: point, focus: editor.end([]) }),
        leaf: editor.leaf(point)[0].text,
        offset: point.offset,
      }
    }, fixture)
    await expect
      .poll(() =>
        element.evaluate(element => {
          const root = element.getRootNode() as
            | Document
            | (ShadowRoot & { getSelection: () => Selection | null })
          const selection = root.getSelection()!
          return {
            inside: element.contains(selection.anchorNode),
            leaf: selection.anchorNode?.textContent?.replace(/\uFEFF/g, ''),
            offset: selection.anchorOffset,
          }
        })
      )
      .toEqual({
        inside: true,
        leaf: original.leaf,
        offset: original.leaf === '' ? 1 : original.offset,
      })
    let blockCount = await element
      .locator('[data-slate-node="element"]')
      .count()
    const cdp = await page.context().newCDPSession(page)
    if (fixture.mode !== 'plain') {
      await cdp.send('Input.imeSetComposition', {
        text: 'n',
        selectionStart: 1,
        selectionEnd: 1,
      })
      await cdp.send('Input.imeSetComposition', {
        text: 'ni',
        selectionStart: 2,
        selectionEnd: 2,
      })
    }
    if (
      fixture.mode === 'replace' ||
      fixture.mode === 'cancel' ||
      fixture.mode === 'update'
    ) {
      await cdp.send('Input.imeSetComposition', {
        text: 'AAA\nBBB',
        selectionStart: 7,
        selectionEnd: 7,
      })
    }
    if (fixture.mode === 'update') {
      await editor.evaluate(editor =>
        editor.insertNodes(
          { children: [{ text: 'remote' }] },
          { at: [editor.children.length] }
        )
      )
      await expect(element).toContainText('remote')
      original.suffix += 'remote'
      blockCount += 1
    }
    const commit = fixture.mode === 'cancel' ? '' : fixture.commit ?? 'AAA\nBBB'
    if (fixture.mode === 'cancel') {
      await cdp.send('Input.imeSetComposition', {
        text: '',
        selectionStart: 0,
        selectionEnd: 0,
      })
    } else {
      await cdp.send('Input.insertText', { text: commit })
    }
    const expected = original.prefix + commit + original.suffix
    const domText = async () =>
      (await element.locator('[data-slate-string]').allTextContents()).join('')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe(expected)
    await expect.poll(domText).toBe(expected)
    await expect(element.locator('[data-slate-node="element"]')).toHaveCount(
      blockCount
    )
    await page.keyboard.type('Z')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe(original.prefix + commit + 'Z' + original.suffix)
    await expect
      .poll(domText)
      .toBe(original.prefix + commit + 'Z' + original.suffix)
    await editor.evaluate(editor => (editor as HistoryEditor).undo())
    const afterUndo = await editor.evaluate(editor => editor.string([]))
    expect(afterUndo).not.toBe(original.prefix + commit + 'Z' + original.suffix)
    await expect.poll(domText).toBe(afterUndo)
    await editor.evaluate(editor => (editor as HistoryEditor).redo())
    await expect
      .poll(domText)
      .toBe(original.prefix + commit + 'Z' + original.suffix)
    expect(errors).toEqual([])
  })
}
