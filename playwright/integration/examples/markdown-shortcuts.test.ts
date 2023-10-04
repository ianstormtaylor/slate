import { test, expect } from '@playwright/test'

test.describe('On markdown-shortcuts example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/markdown-shortcuts')
  })

  test('contains quote', async ({ page }) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('blockquote')
        .textContent()
    ).toContain('A wise quote.')
  })

  test('can add list items', async ({ page }, testInfo) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('ul')
        .count()
    ).toBe(0)

    await page.getByRole('textbox').click()
    await page
      .getByRole('textbox')
      .press(testInfo.project.name === 'webkit' ? 'Meta+ArrowLeft' : 'Home')
    await page.getByRole('textbox').type('* 1st Item')
    await page.keyboard.press('Enter')
    await page.getByRole('textbox').type('2nd Item')
    await page.keyboard.press('Enter')
    await page.getByRole('textbox').type('3rd Item')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Backspace')

    expect(await page.locator('ul > li').count()).toBe(3)

    expect(
      await page
        .locator('ul > li')
        .nth(0)
        .innerText()
    ).toContain('1st Item')
    expect(
      await page
        .locator('ul > li')
        .nth(1)
        .innerText()
    ).toContain('2nd Item')
    expect(
      await page
        .locator('ul > li')
        .nth(2)
        .innerText()
    ).toContain('3rd Item')
  })

  test('can add a h1 item', async ({ page }) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('h1')
        .count()
    ).toBe(0)

    await page.getByRole('textbox').press('Enter')
    await page.getByRole('textbox').press('ArrowLeft')
    await page.getByRole('textbox').type('# Heading')

    expect(await page.locator('h1').count()).toBe(1)

    expect(
      await page
        .getByRole('textbox')
        .locator('h1')
        .textContent()
    ).toContain('Heading')
  })
})
