import { test, expect } from '@playwright/test'
import { clearEditor, getEditorHandle } from '../support/editor'

test.describe('Inlines example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/inlines')
  })

  test('contains link', async ({ page }) => {
    expect(
      await page.getByRole('textbox').locator('a').nth(0).innerText()
    ).toContain('hyperlink')
  })

  for (const scenario of [
    {
      name: 'end of link',
      anchor: 4,
      focus: 4,
      links: ['link'],
      paragraphs: ['before link', ' after'],
    },
    {
      name: 'middle of link',
      anchor: 2,
      focus: 2,
      links: ['li', 'nk'],
      paragraphs: ['before li', 'nk after'],
    },
    {
      name: 'selected link text',
      anchor: 1,
      focus: 3,
      links: ['l', 'k'],
      paragraphs: ['before l', 'k after'],
    },
  ]) {
    test(`Enter at ${scenario.name}`, async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name === 'mobile',
        'Synthetic Enter does not simulate a soft keyboard'
      )
      const element = page.getByRole('textbox')
      await clearEditor(element)
      const editor = await getEditorHandle(element)
      await editor.evaluate((editor, scenario) => {
        editor.insertText('before ')
        const link = {
          type: 'link',
          url: 'https://example.com',
          children: [{ text: 'link' }],
        }
        editor.insertNodes(link)
        editor.select({ path: [0, 2], offset: 0 })
        editor.insertText(' after')
        editor.select({
          anchor: { path: [0, 1, 0], offset: scenario.anchor },
          focus: { path: [0, 1, 0], offset: scenario.focus },
        })
      }, scenario)
      await expect
        .poll(() =>
          element.evaluate(element => {
            const selection = window.getSelection()!
            return (
              selection.anchorNode?.parentElement?.closest('a') !== null &&
              selection.anchorOffset
            )
          })
        )
        .toBe(scenario.anchor)
      await page.keyboard.press('Enter')
      await expect(element.locator('a')).toHaveText(scenario.links)
      expect(
        await editor.evaluate(editor =>
          editor.children.map((_, index) => editor.string([index]))
        )
      ).toEqual(scenario.paragraphs)
      await editor.dispose()
    })
  }

  // FIXME: unstable, has issues with selection.anchorNode
  test.skip('arrow keys skip over read-only inline', async ({ page }) => {
    const badge = page.locator('text=Approved >> xpath=../../..')

    // Put cursor after the badge
    await badge.evaluate(badgeElement => {
      const range = document.createRange()
      range.setStartAfter(badgeElement)
      range.setEndAfter(badgeElement)
      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)
    })

    const getSelectionContainerText = () =>
      page.evaluate(() => {
        const selection = window.getSelection()!
        return selection.anchorNode!.textContent
      })

    expect(await getSelectionContainerText()).toBe('.')
    await page.keyboard.press('ArrowLeft')
    expect(await getSelectionContainerText()).toBe(
      '! Here is a read-only inline: '
    )
    await page.keyboard.press('ArrowRight')
    expect(await getSelectionContainerText()).toBe('.')
  })
})
