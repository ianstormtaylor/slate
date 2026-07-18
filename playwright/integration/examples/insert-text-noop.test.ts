import { test, expect } from '@playwright/test'

test.describe('insert-text-noop example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/insert-text-noop')
  )

  test('typing an uppercase letter that insertText ignores leaves the DOM untouched', async ({
    page,
  }) => {
    const textbox = page.getByRole('textbox')
    await textbox.click()
    await page.keyboard.press('End')
    await textbox.pressSequentially('X')

    // Give any (buggy or fixed) async reconciliation a moment to settle.
    await page.waitForTimeout(200)

    expect(await textbox.textContent()).toBe('abc')
  })

  test('typing a lowercase letter after a blocked uppercase one still works correctly', async ({
    page,
  }) => {
    const textbox = page.getByRole('textbox')
    await textbox.click()
    await page.keyboard.press('End')
    await textbox.pressSequentially('Xd')

    await page.waitForTimeout(200)

    expect(await textbox.textContent()).toBe('abcd')
  })
})
