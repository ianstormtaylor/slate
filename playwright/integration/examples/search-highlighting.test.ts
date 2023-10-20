import { test, expect } from '@playwright/test'

test.describe('search highlighting', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/search-highlighting')
  )

  test('highlights the searched text', async ({ page }) => {
    const searchField = 'input[type="search"]'
    const highlightedText = 'search-highlighted'

    await page.locator(searchField).fill('text')
    await expect(page.locator(`[data-cy="${highlightedText}"]`)).toHaveCount(2)
  })
})
