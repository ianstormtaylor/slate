import { test, expect, Page } from '@playwright/test'

const placeCaretAtEnd = async (page: Page) => {
  await page.getByRole('textbox').click()
  await page.evaluate(() => {
    const strings = document.querySelectorAll('[data-slate-string]')
    const text = strings[strings.length - 1].firstChild!
    const end = text.textContent!.length
    window.getSelection()!.setBaseAndExtent(text, end, text, end)
  })
  await page.waitForTimeout(200)
}

test.describe('input events dispatched by script', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/plaintext')
    await placeCaretAtEnd(page)
  })

  test('inserts text from a scripted insertText beforeinput', async ({
    page,
  }) => {
    await page.evaluate(() => {
      document.querySelector('[data-slate-editor]')!.dispatchEvent(
        new InputEvent('beforeinput', {
          inputType: 'insertText',
          data: 'Zed',
          bubbles: true,
          cancelable: true,
        })
      )
    })
    await expect(page.getByRole('textbox')).toContainText('<textarea>!Zed')
  })

  test('inserts text from a scripted insertFromPaste beforeinput', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'WebKit drops dataTransfer from script-constructed InputEvents'
    )
    await page.evaluate(() => {
      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text/plain', 'pasted')
      document.querySelector('[data-slate-editor]')!.dispatchEvent(
        new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          dataTransfer,
          bubbles: true,
          cancelable: true,
        })
      )
    })
    await expect(page.getByRole('textbox')).toContainText('<textarea>!pasted')
  })
})
