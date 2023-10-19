import { test, expect } from '@playwright/test'

test.describe('huge document example', () => {
  const elements = [
    { tag: '#__next h1', count: 100 },
    { tag: '#__next p', count: 700 },
  ]

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/huge-document')
  })

  test('contains image', async ({ page }) => {
    for (const { tag, count } of elements) {
      await expect(page.locator(tag)).toHaveCount(count)
    }
  })
})
