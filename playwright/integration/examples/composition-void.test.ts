import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('composing while a block void is selected', () => {
  test('does not leave composed text inside the void', async ({
    page,
    browserName,
  }, info) => {
    test.skip(
      browserName !== 'chromium' || info.project.name === 'mobile',
      'Drives the IME through the Chromium DevTools protocol'
    )
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/examples/images')
    const element = page.getByRole('textbox')
    await element.locator('img').first().click()

    const editor = await getEditorHandle(element)
    const before = await editor.evaluate(editor => editor.children.length)

    const cdp = await page.context().newCDPSession(page)
    for (const text of ['n', 'ni', 'ni h', 'ni ha', 'ni hao']) {
      await cdp.send('Input.imeSetComposition', {
        text,
        selectionStart: text.length,
        selectionEnd: text.length,
      })
    }
    await cdp.send('Input.insertText', { text: '你好' })
    await page.waitForTimeout(300)

    const voidText = await element
      .locator('[data-slate-void="true"] [data-slate-spacer]')
      .first()
      .evaluate(node => node.textContent?.replace(/\uFEFF/g, ''))
    expect(voidText).toBe('')
    const model = await editor.evaluate(editor =>
      editor.children.map(node => ({
        type: (node as { type?: string }).type,
        text: editor.string([editor.children.indexOf(node)]),
      }))
    )
    expect(model[1]).toEqual({ type: 'image', text: '' })
    expect(model.length).toBeGreaterThanOrEqual(before)
    expect(errors).toEqual([])
    await editor.dispose()
  })
})
