import { test, expect } from '@playwright/test'
import { dispatchDropEvent } from '../../playwrightTestHelpers'

test.describe('shadow-dom example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/shadow-dom')
  )

  test('renders slate editor inside nested shadow', async ({ page }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')

    await expect(innerShadow.getByRole('textbox')).toHaveCount(1)
  })

  test('renders slate editor inside nested shadow and edits content', async ({
    page,
  }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')

    // Ensure the textbox is present
    await expect(textbox).toHaveCount(1)

    // Clear any existing text and type new text into the textbox
    await textbox.fill('Hello, Playwright!')

    // Assert that the textbox contains the correct text
    await expect(textbox).toHaveText('Hello, Playwright!')
  })
  test('drag and drop text above the textbox', async ({ page }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')

    const textbox = innerShadow.getByRole('textbox')
    await textbox.fill('test ')

    const droppedText = 'droppedText'
    const textboxEl = (await textbox.elementHandle()) as HTMLElement
    const { x, y, width, height } = await textbox.boundingBox()
    await dispatchDropEvent({
      page,
      element: textboxEl,
      droppedText: droppedText,
      clientX: x + width - 5,
      clientY: y + height / 2,
    })

    const expectedText = `test ${droppedText}`
    await expect(textbox).toHaveText(expectedText)
  })
})
