import { test, expect } from '@playwright/test'

test.describe('Inlines example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/inlines')
  })

  test('contains link', async ({ page }) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('a')
        .nth(0)
        .innerText()
    ).toContain('hyperlink')
  })

  test('arrow keys skip over read-only inline', async ({ page }) => {
    const badge = await page.locator('text=Approved >> xpath=../../..')

    // Put cursor after the badge
    await badge.evaluate(badgeElement => {
      const range = document.createRange()
      range.setStartAfter(badgeElement, 0)
      range.setEndAfter(badgeElement, 0)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    })

    const getSelectionContainerText = () =>
      page.evaluate(() => {
        const selection = window.getSelection()
        return selection.anchorNode.parentNode.innerText
      })

    expect(await getSelectionContainerText()).toBe('.')
    await page.keyboard.press('ArrowLeft')
    expect(await getSelectionContainerText()).toBe(
      '! Here is a read-only inline: '
    )
    await page.keyboard.press('ArrowRight')
    expect(await getSelectionContainerText()).toBe('.')
  })
})
