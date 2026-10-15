import { expect, test } from '@playwright/test'
import { getEditorHandle } from './support/editor'

for (const action of ['Backspace', 'Cut']) {
  test(`triple-click and ${action} follow native block deletion`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop triple-click selection')
    await page.goto('/playwright/triple-click')
    const key =
      action === 'Cut'
        ? `${process.platform === 'darwin' ? 'Meta' : 'Control'}+x`
        : 'Backspace'
    const native = page.getByRole('textbox', { name: 'Native', exact: true })
    await native
      .locator(':scope > div')
      .nth(1)
      .click({ clickCount: 3, position: { x: 10, y: 16 } })
    await page.keyboard.press(key)
    const expected = await native.evaluate(element =>
      Array.from(element.children, child => child.textContent || '')
    )
    expect(expected).not.toEqual(['alpha', 'beta', 'gamma'])
    const slate = page.getByRole('textbox', { name: 'Slate', exact: true })
    await slate.locator('[data-slate-string]').nth(1).click({ clickCount: 3 })
    await page.keyboard.press(key)
    const editor = await getEditorHandle(slate)
    await expect
      .poll(() =>
        editor.evaluate(editor =>
          editor.children.map((_, index) => editor.string([index]))
        )
      )
      .toEqual(expected)
    await editor.dispose()
  })

  test(`triple-click and ${action} retain isolated blocks`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop triple-click selection')
    await page.goto('/playwright/triple-click')
    const slate = page.getByRole('textbox', { name: 'Isolated', exact: true })
    await slate
      .locator(':scope > [data-slate-node="element"]')
      .nth(1)
      .click({ clickCount: 3, position: { x: 300, y: 16 } })
    await page.keyboard.press(
      action === 'Cut'
        ? `${process.platform === 'darwin' ? 'Meta' : 'Control'}+x`
        : 'Backspace'
    )
    const editor = await getEditorHandle(slate)
    await expect
      .poll(() =>
        editor.evaluate(editor =>
          editor.children.map((_, index) => editor.string([index]))
        )
      )
      .toEqual(['alpha', '', 'gamma'])
    await editor.dispose()
  })
}
