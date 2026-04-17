import { expect, test } from '@playwright/test'

test.describe('plaintext example', () => {
  test.beforeEach(async ({ page }) => await page.goto('/examples/plaintext'))

  test('inserts text when typed', async ({ page }) => {
    const insertedText = ' Hello World'

    await page.getByRole('textbox').click()
    await page.getByRole('textbox').press('End')
    await page.getByRole('textbox').pressSequentially(insertedText)

    await expect(page.getByRole('textbox')).toContainText(insertedText)
  })
})
