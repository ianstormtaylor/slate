import { test, expect } from '@playwright/test'

test.describe('mentions example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/mentions')
  )

  test('renders mention element', async ({ page }) => {
    expect(await page.locator('[data-cy="mention-R2-D2"]').count()).toBe(1)
    expect(await page.locator('[data-cy="mention-Mace-Windu"]').count()).toBe(1)
  })

  test('shows list of mentions', async ({ page }) => {
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').selectText()
    await page.getByRole('textbox').press('Backspace')
    await page.getByRole('textbox').type(' @ma')
    expect(await page.locator('[data-cy="mentions-portal"]').count()).toBe(1)
  })

  test('inserts on enter from list', async ({ page }) => {
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').selectText()
    await page.getByRole('textbox').press('Backspace')
    await page.getByRole('textbox').type(' @Ja')
    await page.getByRole('textbox').press('Enter')
    expect(await page.locator('[data-cy="mention-Jabba"]').count()).toBe(1)
  })
})
