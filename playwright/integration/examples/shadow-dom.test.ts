import { expect, type Locator, type Page, test } from '@playwright/test'

const focusTextboxEnd = async (textbox: Locator) => {
  await textbox.evaluate((element: Element) => {
    const editable = element as HTMLElement
    const root = editable.getRootNode() as Document | ShadowRoot
    const selection =
      'getSelection' in root ? root.getSelection() : window.getSelection()
    const range = editable.ownerDocument.createRange()

    editable.focus()
    range.selectNodeContents(editable)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
  })
}

const waitForShadowBreakSync = async ({
  page,
  textbox,
}: {
  page: Page
  textbox: Locator
}) => {
  await expect(textbox.locator('[data-slate-node="element"]')).toHaveCount(2)
  await page.waitForTimeout(100)
  await focusTextboxEnd(textbox)
}

const typeShadowText = async ({
  browserName,
  textbox,
  page,
  projectName,
  text,
}: {
  browserName: string
  textbox: Locator
  page: Page
  projectName: string
  text: string
}) => {
  if (projectName === 'mobile') {
    await page.keyboard.type(text, { delay: 50 })
    return
  }

  if (browserName === 'webkit') {
    await textbox.pressSequentially(text, { delay: 25 })
    return
  }

  await page.keyboard.insertText(text)
}

test.describe('shadow-dom example', () => {
  test.beforeEach(async ({ page }) => await page.goto('/examples/shadow-dom'))

  test('renders slate editor inside nested shadow', async ({ page }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')

    await expect(innerShadow.getByRole('textbox')).toHaveCount(1)
  })

  test('renders slate editor inside nested shadow and edits content', async ({
    browserName,
    page,
  }, testInfo) => {
    test.skip(
      browserName === 'webkit',
      'WebKit does not reliably deliver typing into this nested shadow-root contenteditable example.'
    )

    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')

    // Ensure the textbox is present
    await expect(textbox).toHaveCount(1)

    await textbox.click()
    await focusTextboxEnd(textbox)
    await typeShadowText({
      browserName,
      textbox,
      page,
      projectName: testInfo.project.name,
      text: ' Hello, Playwright!',
    })

    await expect(textbox).toContainText('Hello, Playwright!')
  })

  test('user can type add a new line in editor inside shadow DOM', async ({
    browserName,
    page,
  }, testInfo) => {
    test.skip(
      browserName === 'webkit',
      'WebKit does not reliably deliver typing into this nested shadow-root contenteditable example.'
    )

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    const pageErrors: Error[] = []
    page.on('pageerror', (error) => {
      pageErrors.push(error)
    })

    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')

    await textbox.click()
    await focusTextboxEnd(textbox)
    if (browserName === 'webkit') {
      await textbox.press('Enter')
    } else {
      await page.keyboard.press('Enter')
    }
    await waitForShadowBreakSync({ page, textbox })
    await typeShadowText({
      browserName,
      textbox,
      page,
      projectName: testInfo.project.name,
      text: 'New line text',
    })

    expect(consoleErrors, 'Console errors occurred').toEqual([])
    expect(pageErrors, 'Page errors occurred').toEqual([])

    await expect(textbox).toContainText('New line text')
  })
})
