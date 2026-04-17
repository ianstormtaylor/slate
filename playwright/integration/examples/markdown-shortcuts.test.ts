import { expect, type Locator, test } from '@playwright/test'

const focusTextboxStart = async (textbox: Locator) => {
  await textbox.evaluate((element: Element) => {
    const editable = element as HTMLElement
    const selection = window.getSelection()
    const range = editable.ownerDocument.createRange()

    editable.focus()
    range.selectNodeContents(editable)
    range.collapse(true)
    selection?.removeAllRanges()
    selection?.addRange(range)
  })
}

test.describe('On markdown-shortcuts example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/markdown-shortcuts')
    await expect(page.getByRole('textbox').locator('blockquote')).toContainText(
      'A wise quote.'
    )
  })

  test('contains quote', async ({ page }) => {
    expect(
      await page.getByRole('textbox').locator('blockquote').textContent()
    ).toContain('A wise quote.')
  })

  test('can add list items', async ({ page }) => {
    const textbox = page.getByRole('textbox')

    await expect(textbox.locator('ul')).toHaveCount(0)

    await textbox.click()
    await focusTextboxStart(textbox)
    await textbox.pressSequentially('* ')
    await textbox.pressSequentially('1st Item')
    await page.keyboard.press('Enter')
    await textbox.pressSequentially('2nd Item')
    await page.keyboard.press('Enter')
    await textbox.pressSequentially('3rd Item')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Backspace')

    await expect(page.locator('ul > li')).toHaveCount(3)

    expect(await page.locator('ul > li').nth(0).innerText()).toContain(
      '1st Item'
    )
    expect(await page.locator('ul > li').nth(1).innerText()).toContain(
      '2nd Item'
    )
    expect(await page.locator('ul > li').nth(2).innerText()).toContain(
      '3rd Item'
    )
  })

  test('can add a h1 item', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('h1')).toHaveCount(0)

    await page.getByRole('textbox').press('Enter')
    await page.getByRole('textbox').press('ArrowLeft')
    await page.getByRole('textbox').pressSequentially('# ')
    await page.getByRole('textbox').pressSequentially('Heading')

    await expect(page.locator('h1')).toHaveCount(1)

    expect(
      await page.getByRole('textbox').locator('h1').textContent()
    ).toContain('Heading')
  })
})
