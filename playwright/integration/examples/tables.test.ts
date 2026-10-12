import { test, expect, Page } from '@playwright/test'
import {
  cutWithShortcut,
  dragSelection,
  selectStrings,
} from '../support/move-text'

const cellCounts = (page: Page) =>
  page
    .getByRole('textbox')
    .locator('tr')
    .evaluateAll(rows => rows.map(row => row.querySelectorAll('td').length))

test.describe('table example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/tables')
  })

  test('table tag rendered', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('table')).toHaveCount(1)
  })

  test('dragging from one cell into the next keeps every cell', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'firefox', 'Native text drags need Firefox')
    await selectStrings(
      page,
      { text: 'Human', offset: 0 },
      { text: 'Dog', offset: 0 }
    )
    await dragSelection(page, 'Human', { text: 'Cat', edge: 'end' })
    await expect(page.getByRole('textbox')).toContainText('CatHuman')
    expect(await cellCounts(page)).toEqual([4, 4, 4])
  })

  test('cutting across cells clears them without merging', async ({ page }) => {
    await selectStrings(
      page,
      { text: 'Human', offset: 1 },
      { text: 'Dog', offset: 2 }
    )
    await cutWithShortcut(page)
    expect(await cellCounts(page)).toEqual([4, 4, 4])
    const header = page.getByRole('textbox').locator('tr').first()
    await expect(header.locator('td')).toHaveText(['', 'H', 'g', 'Cat'])
  })

  const withEditor = <T>(page: Page, fn: string) =>
    page.evaluate(source => {
      const element = document.querySelector('[data-slate-editor]')!
      const fiberKey = Object.keys(element).find(key =>
        key.startsWith('__reactFiber$')
      )!
      let fiber = (element as any)[fiberKey]
      while (fiber && !fiber.memoizedProps?.editor) {
        fiber = fiber.return
      }
      return new Function('editor', source)(fiber.memoizedProps.editor)
    }, fn) as Promise<T>

  const lastCellText = (page: Page) =>
    withEditor<string>(
      page,
      'return editor.children[1].children.at(-1).children.at(-1).children[0].text'
    )

  test('arrow down at the end of a final table keeps the caret in the table', async ({
    page,
  }) => {
    await page.getByRole('textbox').click()
    await withEditor(
      page,
      `editor.removeNodes({ at: [editor.children.length - 1] })
       const row = editor.children[1].children.length - 1
       const cell = editor.children[1].children[row].children.length - 1
       const text = editor.children[1].children[row].children[cell].children[0].text
       editor.select({ path: [1, row, cell, 0], offset: text.length })`
    )
    await page.waitForTimeout(300)
    const before = await lastCellText(page)

    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(300)
    await page.keyboard.type('Z')

    await expect.poll(() => lastCellText(page)).toBe(`${before}Z`)
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .querySelector('[data-slate-editor]')!
              .textContent!.split('Z').length - 1
        )
      )
      .toBe(1)
  })

  test('arrow up at the start of a leading table keeps the caret in the table', async ({
    page,
  }) => {
    await page.getByRole('textbox').click()
    await withEditor(
      page,
      `editor.removeNodes({ at: [0] })
       editor.select({ path: [0, 0, 0, 0], offset: 0 })`
    )
    await page.waitForTimeout(300)

    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(300)
    await page.keyboard.type('Z')

    await expect
      .poll(() =>
        withEditor<string>(
          page,
          'return editor.children[0].children[0].children[0].children[0].text'
        )
      )
      .toBe('Z')
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .querySelector('[data-slate-editor]')!
              .textContent!.split('Z').length - 1
        )
      )
      .toBe(1)
  })
})
