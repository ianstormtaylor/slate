import { test, expect } from '@playwright/test'

test.describe('On richtext example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/richtext')
  )

  test('renders rich text', async ({ page }) => {
    expect(await page.locator('strong').nth(0).textContent()).toContain('rich')
    expect(await page.locator('blockquote').textContent()).toContain(
      'wise quote'
    )
  })

  test('inserts text when typed', async ({ page }) => {
    await page.getByRole('textbox').press('Home')
    await page.getByRole('textbox').pressSequentially('Hello World')

    expect(await page.getByRole('textbox').textContent()).toContain(
      'Hello World'
    )
  })
})
