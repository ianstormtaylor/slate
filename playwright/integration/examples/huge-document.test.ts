import { test, expect } from '@playwright/test'

test.describe('huge document example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/huge-document')
  })

  test('uses chunking', async ({ page }) => {
    await expect(page.getByLabel('Blocks')).toHaveValue('10000')
    await expect(page.getByLabel('Chunk size')).toHaveValue('1000')
    await expect(page.locator('[data-slate-chunk]')).toHaveCount(10)
  })
})
