import { test, expect } from '@playwright/test'

test.describe('placeholder example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/custom-placeholder')
  )

  test('renders custom placeholder', async ({ page }) => {
    const placeholderElement = page.locator('[data-slate-placeholder=true]')

    expect(await placeholderElement.textContent()).toContain('Type something')
    expect(await page.locator('pre').textContent()).toContain(
      'renderPlaceholder'
    )
  })

  test('renders editor tall enough to fit placeholder', async ({ page }) => {
    const slateEditor = page.locator('[data-slate-editor=true]')
    const placeholderElement = page.locator('[data-slate-placeholder=true]')

    await expect(placeholderElement).toBeVisible()

    const editorBoundingBox = await slateEditor.boundingBox()
    const placeholderBoundingBox = await placeholderElement.boundingBox()

    if (!editorBoundingBox)
      throw new Error('Could not get bounding box for editor')
    if (!placeholderBoundingBox)
      throw new Error('Could not get bounding box for placeholder')

    expect(editorBoundingBox.height).toBeGreaterThanOrEqual(
      placeholderBoundingBox.height
    )
  })
})
