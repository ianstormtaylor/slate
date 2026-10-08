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

  test('autoFocus lets you type right away in strict mode', async ({
    page,
  }) => {
    await page.goto(
      'http://localhost:3000/examples/huge-document?strict=true&blocks=10&chunking=false'
    )
    const firstBlock = page
      .getByRole('textbox')
      .locator('[data-slate-node="element"]')
      .first()
    await expect(firstBlock).toBeVisible()
    await expect(page.getByRole('textbox')).toBeFocused()
    await page.keyboard.type('Typed')
    await expect(firstBlock).toContainText('Typed')
  })
})
