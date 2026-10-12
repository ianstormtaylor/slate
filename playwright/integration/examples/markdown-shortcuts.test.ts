import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('On markdown-shortcuts example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/markdown-shortcuts')
  })

  const cases = [
    {
      name: 'heading at document start',
      value: [{ type: 'heading-one', children: [{ text: 'title' }] }],
      at: { path: [0, 0], offset: 0 },
      expected: [{ type: 'paragraph', children: [{ text: 'title' }] }],
    },
    {
      name: 'empty heading at document start',
      value: [{ type: 'heading-one', children: [{ text: '' }] }],
      at: { path: [0, 0], offset: 0 },
      expected: [{ type: 'paragraph', children: [{ text: '' }] }],
    },
    {
      name: 'quote at document start',
      value: [{ type: 'block-quote', children: [{ text: 'quote' }] }],
      at: { path: [0, 0], offset: 0 },
      expected: [{ type: 'paragraph', children: [{ text: 'quote' }] }],
    },
    {
      name: 'list at document start',
      value: [
        {
          type: 'bulleted-list',
          children: [{ type: 'list-item', children: [{ text: 'item' }] }],
        },
      ],
      at: { path: [0, 0, 0], offset: 0 },
      expected: [{ type: 'paragraph', children: [{ text: 'item' }] }],
    },
    {
      name: 'text inside a heading',
      value: [{ type: 'heading-one', children: [{ text: 'title' }] }],
      at: { path: [0, 0], offset: 1 },
      expected: [{ type: 'heading-one', children: [{ text: 'itle' }] }],
    },
  ]

  for (const scenario of cases) {
    test(`Backspace handles ${scenario.name}`, async ({ page }) => {
      const element = page.getByRole('textbox')
      const editor = await getEditorHandle(element)
      await element.focus()
      await editor.evaluate((editor, scenario) => {
        editor.children = scenario.value
        editor.select(scenario.at)
        editor.onChange()
      }, scenario)
      await expect
        .poll(() =>
          element.evaluate(element => {
            const selection = window.getSelection()!
            return {
              inside: element.contains(selection.anchorNode),
              offset: selection.anchorNode?.parentElement?.closest(
                '[data-slate-zero-width]'
              )
                ? 0
                : selection.anchorOffset,
            }
          })
        )
        .toEqual({ inside: true, offset: scenario.at.offset })
      await page.keyboard.press('Backspace')
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(scenario.expected)
      await editor.dispose()
    })
  }

  test('contains quote', async ({ page }) => {
    expect(
      await page.getByRole('textbox').locator('blockquote').textContent()
    ).toContain('A wise quote.')
  })

  test('can add list items', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('ul')).toHaveCount(0)

    await page.getByRole('textbox').focus()
    const editor = await getEditorHandle(page.getByRole('textbox'))
    await editor.evaluate(editor => editor.select(editor.start([])))
    await editor.dispose()
    await expect
      .poll(() => page.evaluate(() => window.getSelection()!.anchorOffset))
      .toBe(0)
    await page.getByRole('textbox').pressSequentially('* ')
    await page.getByRole('textbox').pressSequentially('1st Item')
    await page.keyboard.press('Enter')
    await page.getByRole('textbox').pressSequentially('2nd Item')
    await page.keyboard.press('Enter')
    await page.getByRole('textbox').pressSequentially('3rd Item')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Backspace')

    await expect(page.locator('ul > li')).toHaveCount(3)

    expect(await page.locator('ul > li').nth(0).innerText()).toContain(
      '1st Item'
    )
    expect(await page.locator('ul > li').nth(1).innerText()).toContain(
      '2nd Item'
    )
    expect(await page.locator('ul > li').nth(2).innerText()).toContain(
      '3rd Item'
    )
  })

  test('can add a h1 item', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('h1')).toHaveCount(0)

    await page.getByRole('textbox').press('Enter')
    await page.getByRole('textbox').press('ArrowLeft')
    await page.getByRole('textbox').pressSequentially('# ')
    await page.getByRole('textbox').pressSequentially('Heading')

    await expect(page.locator('h1')).toHaveCount(1)

    expect(
      await page.getByRole('textbox').locator('h1').textContent()
    ).toContain('Heading')
  })
})
