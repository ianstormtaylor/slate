import { test, expect } from '@playwright/test'

test.describe('hovering toolbar example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/hovering-toolbar')
  })

  test('hovering toolbar appears', async ({ page }) => {
    await page.pause()
    await expect(page.locator('div').nth(12)).toHaveCSS('opacity', '0')

    await page
      .locator('span[data-slate-string="true"]')
      .nth(0)
      .selectText()
    expect(
      await page
        .locator('div')
        .nth(12)
        .count()
    ).toBe(1)

    await expect(page.locator('div').nth(12)).toHaveCSS('opacity', '1')
    expect(
      await page
        .locator('div')
        .nth(12)
        .locator('span.material-icons')
        .count()
    ).toBe(3)
  })

  test('hovering toolbar disappears', async ({ page }) => {
    await page
      .locator('span[data-slate-string="true"]')
      .nth(0)
      .selectText()
    await expect(page.locator('div').nth(12)).toHaveCSS('opacity', '1')
    await page
      .locator('span[data-slate-string="true"]')
      .nth(0)
      .selectText()
    await page
      .locator('div')
      .nth(0)
      .click({ force: true })
    await expect(page.locator('div').nth(12)).toHaveCSS('opacity', '0')
  })
})
