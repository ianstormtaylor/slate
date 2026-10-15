import { test, expect } from '@playwright/test'
import { getEditorHandle } from './support/editor'

test.beforeEach(async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard tab navigation requires a desktop browser')
  await page.goto('/playwright/keyboard-focus')
})

test('tabbing back restores the existing caret', async ({ page }) => {
  const element = page.getByRole('textbox')
  const editor = await getEditorHandle(element)
  await element.click()
  await editor.evaluate(editor => editor.select({ path: [0, 0], offset: 5 }))
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'After editor' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(element).toBeFocused()
  await page.keyboard.type('X')
  await expect(element).toHaveText('helloX world')
})

test('tabbing into an unselected editor uses the browser caret', async ({
  page,
}) => {
  const element = page.getByRole('textbox')
  const editor = await getEditorHandle(element)
  expect(await editor.evaluate(editor => editor.selection)).toBeNull()
  await page.getByRole('button', { name: 'Before editor' }).focus()
  await page.keyboard.press('Tab')
  await expect(element).toBeFocused()
  await page.keyboard.type('X')
  await expect(element).toHaveText('Xhello world')
})

test('mouse focus keeps the clicked caret', async ({ page }) => {
  const element = page.getByRole('textbox')
  const editor = await getEditorHandle(element)
  await element.click()
  await editor.evaluate(editor => editor.select({ path: [0, 0], offset: 5 }))
  await page.getByRole('button', { name: 'After editor' }).click()
  const text = element.locator('[data-slate-string]')
  const box = (await text.boundingBox())!
  await page.mouse.click(box.x + 1, box.y + box.height / 2)
  await page.keyboard.type('X')
  await expect(element).toHaveText('Xhello world')
})

test('tabbing back restores a backward expanded selection', async ({
  page,
}) => {
  const element = page.getByRole('textbox')
  const editor = await getEditorHandle(element)
  await element.click()
  const selection = {
    anchor: { path: [0, 0], offset: 5 },
    focus: { path: [0, 0], offset: 2 },
  }
  await editor.evaluate(
    (editor, selection) => editor.select(selection),
    selection
  )
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'After editor' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(element).toBeFocused()
  expect(await editor.evaluate(editor => editor.selection)).toEqual(selection)
  await page.keyboard.type('X')
  await expect(element).toHaveText('heX world')
})

test('tabbing back restores the caret in an empty block', async ({ page }) => {
  const element = page.getByRole('textbox')
  const editor = await getEditorHandle(element)
  await element.click()
  await editor.evaluate(editor => {
    editor.select({ anchor: editor.start([]), focus: editor.end([]) })
    editor.deleteFragment()
  })
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'After editor' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(element).toBeFocused()
  expect(
    await element.evaluate(element => {
      const selection = element.ownerDocument.getSelection()!
      return selection.anchorOffset
    })
  ).toBe(1)
  await page.keyboard.type('X')
  await expect(element).toHaveText('X')
})
