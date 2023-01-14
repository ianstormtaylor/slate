import { test, expect } from '@playwright/test'

test.describe('placeholder example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/custom-placeholder')
  )

  test('renders custom placeholder', async ({ page }) => {
    const placeholderElement = page.locator('[data-slate-placeholder=true]')

    expect(await placeholderElement.textContent()).toContain('Type something')
    expect(await page.locator('pre').textContent()).toContain(
      'renderPlaceholder'
    )
  })
})
