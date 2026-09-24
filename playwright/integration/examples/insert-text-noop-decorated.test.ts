import { test, expect } from '@playwright/test'

test.describe('insert-text-noop-decorated example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto(
        'http://localhost:3000/examples/insert-text-noop-decorated'
      )
  )

  test('typing an uppercase letter after a decorated (multi-leaf) run leaves the DOM untouched', async ({
    page,
  }) => {
    const textbox = page.getByRole('textbox')
    await textbox.click()
    await page.keyboard.press('End')
    await textbox.pressSequentially('X')

    // Give any (buggy or fixed) async reconciliation a moment to settle.
    await page.waitForTimeout(200)

    expect(await textbox.textContent()).toBe('abcdef')
  })

  test('typing a lowercase letter after a blocked uppercase one still works correctly', async ({
    page,
  }) => {
    const textbox = page.getByRole('textbox')
    await textbox.click()
    await page.keyboard.press('End')
    await textbox.pressSequentially('Xg')

    await page.waitForTimeout(200)

    expect(await textbox.textContent()).toBe('abcdefg')
  })
})
