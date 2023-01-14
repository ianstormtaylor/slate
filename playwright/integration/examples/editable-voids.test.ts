import { test, expect } from '@playwright/test'

test.describe('editable voids', () => {
  const input = 'input[type="text"]'
  const elements = [
    { tag: 'h4', count: 3 },
    { tag: input, count: 1 },
    { tag: 'input[type="radio"]', count: 2 },
  ]

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/editable-voids')
  })

  test('checks for the elements', async ({ page }) => {
    for (const elem of elements) {
      const { tag, count } = elem
      expect(await page.locator(tag).count()).toBe(count)
    }
  })

  test('should double the elements', async ({ page }) => {
    // click the `+` sign to duplicate the editable void
    await page
      .locator('span.material-icons')
      .nth(1)
      .click()

    for (const elem of elements) {
      const { tag, count } = elem
      expect(await page.locator(tag).count()).toBe(count * 2)
    }
  })

  test('make sure you can edit editable void', async ({ page }) => {
    await page.locator(input).type('Typing')
    expect(await page.locator(input).inputValue()).toBe('Typing')
  })
})
