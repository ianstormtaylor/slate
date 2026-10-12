import { expect, test } from '@playwright/test'
import { getEditorHandle } from './support/editor'

test('typing in a Slate editable island updates its model', async ({
  page,
}) => {
  await page.goto('/playwright/editable-islands')
  const outer = page.getByRole('textbox')
  const editor = await getEditorHandle(outer)
  const island = page.getByTestId('island')
  await island.locator('[data-slate-string]').click()
  await island.evaluate(island => {
    const text = island.querySelector('[data-slate-string]')!.firstChild!
    window.getSelection()!.collapse(text, text.textContent!.length)
  })
  await expect
    .poll(() => editor.evaluate(editor => editor.selection?.anchor.offset))
    .toBe(6)
  await page.keyboard.type('XYZ', { delay: 120 })
  await expect
    .poll(() => editor.evaluate(editor => editor.string([0])))
    .toBe('insideXYZ')
  await expect(island).toHaveText('insideXYZ')
  await page.keyboard.press('Backspace')
  await expect
    .poll(() => editor.evaluate(editor => editor.string([0])))
    .toBe('insideXY')
  await expect(island).toHaveText('insideXY')
  await editor.dispose()
})
