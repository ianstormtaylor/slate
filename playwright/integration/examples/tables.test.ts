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
})
