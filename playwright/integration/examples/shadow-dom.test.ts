import { test, expect } from '@playwright/test'

test.describe('shadow-dom example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/shadow-dom')
  )

  test('renders slate editor inside nested shadow', async ({ page }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')

    expect(await innerShadow.getByRole('textbox').count()).toBe(1)
  })
})
