import { test, expect } from '@playwright/test'

test.describe('plaintext example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/plaintext')
  )

  test('inserts text when typed', async ({ page }) => {
    await page.getByRole('textbox').press('Home')
    await page.getByRole('textbox').pressSequentially('Hello World')
    expect(await page.getByRole('textbox').textContent()).toContain(
      'Hello World'
    )
  })

  test('dragging whole lines keeps the line breaks they carry', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== 'firefox',
      'Only Firefox performs native drags of a text selection under Playwright'
    )
    const textbox = page.getByRole('textbox')
    await textbox.click()
    await textbox.selectText()
    await textbox.press('Backspace')
    await textbox.pressSequentially('one')
    await textbox.press('Enter')
    await textbox.pressSequentially('two')
    await textbox.press('Enter')
    await textbox.pressSequentially('three')

    const lines = page.locator('[data-slate-node="element"]')
    const strings = page.locator('[data-slate-string]')
    await page.evaluate(() => {
      const [, two, three] = document.querySelectorAll('[data-slate-string]')
      window
        .getSelection()!
        .setBaseAndExtent(two.firstChild!, 0, three.firstChild!, 0)
    })
    await expect
      .poll(() => page.evaluate(() => window.getSelection()!.toString()))
      .toBe('two\n')

    const two = (await strings.nth(1).boundingBox())!
    const one = (await strings.nth(0).boundingBox())!
    const twoY = two.y + two.height / 2
    const oneY = one.y + one.height / 2
    await page.mouse.move(two.x + 8, twoY)
    await page.mouse.down()
    await page.mouse.move(two.x + 12, twoY, { steps: 3 })
    await page.mouse.move(one.x + one.width + 2, oneY, { steps: 15 })
    await page.mouse.move(one.x + one.width - 1, oneY, { steps: 5 })
    await page.mouse.up()

    await expect
      .poll(async () =>
        (await lines.allTextContents()).map(text => text.replace(/\uFEFF/g, ''))
      )
      .toEqual(['onetwo', '', 'three'])
  })
})
