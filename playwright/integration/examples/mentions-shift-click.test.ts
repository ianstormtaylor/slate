import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('shift-clicking around a mention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/mentions')
  })

  test('extends a selection from the mention to later text', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    await page.locator('[data-cy="mention-R2-D2"]').click()
    await element
      .locator('[data-slate-string]')
      .last()
      .click({ modifiers: ['Shift'] })

    const editor = await getEditorHandle(element)
    const selection = await editor.evaluate(editor => editor.selection)
    expect(selection?.anchor).toEqual({ path: [1, 1, 0], offset: 0 })
    expect(selection?.focus.path.join()).not.toBe('1,1,0')
    expect(selection?.focus.path[1]).toBeGreaterThan(1)
  })

  test('extends a selection from the mention to earlier text', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    await page.locator('[data-cy="mention-R2-D2"]').click()
    await element
      .locator('[data-slate-string]')
      .first()
      .click({ modifiers: ['Shift'], position: { x: 5, y: 5 } })

    const editor = await getEditorHandle(element)
    const selection = await editor.evaluate(editor => editor.selection)
    expect(selection?.anchor).toEqual({ path: [1, 1, 0], offset: 0 })
    expect(selection?.focus.path).toEqual([0, 0])
  })
})
