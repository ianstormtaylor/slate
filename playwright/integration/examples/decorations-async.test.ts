import { test, expect } from '@playwright/test'

test.describe('decorations-async', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/decorations-async')
  })

  test('highlights duplicate words on initial load', async ({ page }) => {
    // The initial value contains "the" and "fox" more than once.
    // Decorations are computed on mount so highlights should appear immediately.
    await expect(page.locator('[data-cy="highlight"]')).not.toHaveCount(0)
  })

  test('caret does not jump when async decoration fires', async ({ page }) => {
    const editor = page.getByRole('textbox')

    // Move to the end of the editor and type a word that already exists
    // in the first paragraph ("fox"), creating a new duplicate.
    await editor.click()
    await editor.press('ControlOrMeta+End')
    await page.keyboard.type(' fox')

    // Wait for the 600 ms debounce to fire and decorations to update.
    await page.waitForTimeout(800)

    // If the caret jumped, the next character would appear at the wrong
    // position. Type a sentinel character and verify it lands right after
    // the word we typed, not somewhere else in the document.
    await page.keyboard.type('!')

    const lastParagraph = editor
      .locator('[data-slate-node="element"]')
      .last()
    await expect(lastParagraph).toContainText('fox!')
  })
})
