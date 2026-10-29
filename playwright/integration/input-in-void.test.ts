import { test, expect } from '@playwright/test'
import { getEditorHandle } from './support/editor'

test('a focused input inside a selected inline void keeps taking text', async ({
  page,
}) => {
  await page.goto('/examples/mentions')
  const outer = page.locator('[data-slate-editor]')
  await outer.click()
  const editor = await getEditorHandle(outer)

  // An inline void with an input in it, like a combobox input element.
  await outer
    .locator('[data-slate-void][data-slate-inline]')
    .first()
    .evaluate(mention => {
      const input = document.createElement('input')
      input.setAttribute('data-test-id', 'void-input')
      mention.appendChild(input)
    })

  // Select the void and focus its input in the same task, as a combobox does
  // when it inserts its input element.
  await editor.evaluate(editor => {
    const find = (nodes: any[], path: number[]): number[] | undefined => {
      for (const [index, node] of nodes.entries()) {
        if (node.type === 'mention') return [...path, index]
        if (node.children) {
          const found = find(node.children, [...path, index])
          if (found) return found
        }
      }
    }
    editor.select({ path: [...find(editor.children, [])!, 0], offset: 0 })
    document
      .querySelector<HTMLInputElement>('[data-test-id="void-input"]')!
      .focus()
  })
  await editor.dispose()

  const input = page.getByTestId('void-input')
  await expect(input).toBeFocused()
  await input.pressSequentially('Typ')
  // Outlast the 100 ms selection-change throttle, so Slate handles the
  // selectionchange the focused input caused before the next keys.
  await page.waitForTimeout(300)
  await input.pressSequentially('ing')

  await expect(input).toHaveValue('Typing')
  await expect(input).toBeFocused()
})
