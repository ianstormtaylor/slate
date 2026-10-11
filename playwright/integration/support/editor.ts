import { expect, Locator } from '@playwright/test'
import type { BaseEditor } from 'slate'

export const getEditorHandle = (element: Locator) =>
  element.evaluateHandle(element => {
    type Fiber = {
      return: Fiber | null
      memoizedProps?: { editor?: BaseEditor }
    }
    const fiberKey = Object.keys(element).find(key =>
      key.startsWith('__reactFiber$')
    )!
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[
      fiberKey
    ]
    while (fiber && !fiber.memoizedProps?.editor) {
      fiber = fiber.return
    }
    return fiber!.memoizedProps!.editor!
  })

export const clearEditor = async (element: Locator) => {
  await element.click()
  const editor = await getEditorHandle(element)
  await editor.evaluate(editor => {
    editor.select({ anchor: editor.start([]), focus: editor.end([]) })
    editor.deleteFragment()
  })
  await editor.dispose()
  await expect(element.locator('[data-slate-string]')).toHaveCount(0)
}
