import { test, expect, Page } from '@playwright/test'

test.describe('mentions example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/mentions')
  )

  test('renders mention element', async ({ page }) => {
    await expect(page.locator('[data-cy="mention-R2-D2"]')).toHaveCount(1)
    await expect(page.locator('[data-cy="mention-Mace-Windu"]')).toHaveCount(1)
  })

  test('shows list of mentions', async ({ page }) => {
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').selectText()
    await page.getByRole('textbox').press('Backspace')
    await page.getByRole('textbox').pressSequentially(' @ma')
    await expect(page.locator('[data-cy="mentions-portal"]')).toHaveCount(1)
  })

  test('inserts on enter from list', async ({ page }) => {
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').selectText()
    await page.getByRole('textbox').press('Backspace')
    await page.getByRole('textbox').pressSequentially(' @Ja')
    await page.getByRole('textbox').press('Enter')
    await expect(page.locator('[data-cy="mention-Jabba"]')).toHaveCount(1)
  })

  test('shift-click on a mention extends the selection', async ({ page }) => {
    const text = page.getByText('Try mentioning characters, like')
    await text.click({ position: { x: 2, y: 5 } })
    await page
      .locator('[data-cy="mention-Mace-Windu"]')
      .click({ modifiers: ['Shift'] })
    const selected = await page.evaluate(() =>
      window.getSelection()!.toString()
    )
    expect(selected).toContain('mentioning characters, like')
  })

  test('the void spacer is not selectable, so it does not show in a selection', async ({
    page,
  }) => {
    const spacer = page.locator('[data-slate-spacer]').first()
    await expect(spacer).toHaveCSS('user-select', 'none')
  })

  const mentionLine = (page: Page) =>
    page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-slate-node="element"]'))
        .find(e => e.textContent?.includes('Try mentioning'))!
        .textContent!.replace(/\uFEFF/g, '')
    )

  const placeCaret = async (page: Page, at: 'end-of-like' | 'start-of-or') => {
    await page.getByRole('textbox').click()
    await page.evaluate(at => {
      const strings = Array.from(
        document.querySelectorAll('[data-slate-string]')
      )
      const node =
        at === 'end-of-like'
          ? strings.find(e => e.textContent?.startsWith('Try mentioning'))!
              .firstChild!
          : strings.find(e => e.textContent === ' or ')!.firstChild!
      const offset = at === 'end-of-like' ? node.textContent!.length : 0
      window.getSelection()!.setBaseAndExtent(node, offset, node, offset)
    }, at)
    await page.waitForTimeout(200)
  }

  test('arrow keys move forward across a mention', async ({ page }) => {
    await placeCaret(page, 'end-of-like')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.type('X')
    await expect.poll(() => mentionLine(page)).toContain('@R2-D2X or')
  })

  test('arrow keys move back across a mention', async ({ page }) => {
    await placeCaret(page, 'start-of-or')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.type('X')
    await expect.poll(() => mentionLine(page)).toContain('like X@R2-D2')
  })
})
