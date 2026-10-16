import { test, expect } from '@playwright/test'
import { getEditorHandle } from './support/editor'

test('onClick sees the selection the click just made', async ({ page }) => {
  await page.goto('/playwright/onclick-selection')
  const element = page.getByRole('textbox')
  const editor = await getEditorHandle(element)
  const text = element.locator('[data-slate-string]')
  const box = (await text.boundingBox())!
  const xs = [box.x + box.width * 0.2, box.x + box.width * 0.7]
  const settled = []

  for (let i = 0; i < 10; i++) {
    await page.mouse.click(xs[i % 2], box.y + box.height / 2)
    await page.waitForTimeout(250)
    settled.push(await editor.evaluate(editor => editor.selection))
  }

  const seen = await page.evaluate(() => (window as any).__clickSelections)
  expect(seen).toEqual(settled)
})
