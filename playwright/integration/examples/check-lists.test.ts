import { test, expect } from '@playwright/test'
import type { HistoryEditor } from 'slate-history'
import { clearEditor, getEditorHandle } from '../support/editor'

test.describe('Check-lists example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/check-lists')
  })

  for (const scenario of [
    {
      name: 'checked item end',
      checked: true,
      anchor: 4,
      focus: 4,
      texts: ['task', ''],
      checkedAfter: [true, false],
    },
    {
      name: 'checked item middle',
      checked: true,
      anchor: 2,
      focus: 2,
      texts: ['ta', 'sk'],
      checkedAfter: [true, false],
    },
    {
      name: 'checked item start',
      checked: true,
      anchor: 0,
      focus: 0,
      texts: ['', 'task'],
      checkedAfter: [false, true],
    },
    {
      name: 'unchecked item end',
      checked: false,
      anchor: 4,
      focus: 4,
      texts: ['task', ''],
      checkedAfter: [false, false],
    },
    {
      name: 'selected text in a checked item',
      checked: true,
      anchor: 1,
      focus: 3,
      texts: ['t', 'k'],
      checkedAfter: [true, false],
    },
  ]) {
    test(`Enter at ${scenario.name} leaves only the new empty part unchecked`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name === 'mobile',
        'Synthetic Enter does not simulate a soft keyboard'
      )
      const element = page.getByRole('textbox')
      await clearEditor(element)
      const editor = await getEditorHandle(element)
      await editor.evaluate((editor, scenario) => {
        editor.withoutNormalizing(() => {
          editor.removeNodes({ at: [0] })
          const item = {
            type: 'check-list-item',
            checked: scenario.checked,
            children: [{ text: 'task' }],
          }
          editor.insertNodes(item, { at: [0] })
        })
        editor.select({
          anchor: { path: [0, 0], offset: scenario.anchor },
          focus: { path: [0, 0], offset: scenario.focus },
        })
        const historyEditor = editor as HistoryEditor
        historyEditor.history = { undos: [], redos: [] }
      }, scenario)
      await expect
        .poll(() =>
          element.evaluate(element => {
            const selection = window.getSelection()!
            return {
              inside: element.contains(selection.anchorNode),
              text: selection.anchorNode?.textContent,
              offset: selection.anchorOffset,
            }
          })
        )
        .toEqual({ inside: true, text: 'task', offset: scenario.anchor })

      await page.keyboard.press('Enter')

      const expected = scenario.texts.map((text, index) => ({
        type: 'check-list-item',
        checked: scenario.checkedAfter[index],
        children: [{ text }],
      }))
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(expected)
      const checkboxes = element.getByRole('checkbox')
      await expect(checkboxes).toHaveCount(2)
      for (const [index, checked] of scenario.checkedAfter.entries()) {
        await expect(checkboxes.nth(index)).toBeChecked({ checked })
        await expect(
          element
            .locator('[data-slate-node="element"]')
            .nth(index)
            .locator('span[contenteditable="true"]')
        ).toHaveCSS('text-decoration-line', checked ? 'line-through' : 'none')
      }
      expect(await editor.evaluate(editor => editor.selection)).toEqual({
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [1, 0], offset: 0 },
      })

      await editor.evaluate(editor => (editor as HistoryEditor).undo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual([
          {
            type: 'check-list-item',
            checked: scenario.checked,
            children: [{ text: 'task' }],
          },
        ])
      await editor.evaluate(editor => (editor as HistoryEditor).redo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(expected)
      await editor.dispose()
    })
  }

  test('Enter keeps ordinary paragraphs free of checklist properties', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select(editor.end([0]))
      editor.insertBreak()
    })
    expect(await editor.evaluate(editor => editor.children[1])).toEqual({
      type: 'paragraph',
      children: [{ text: '' }],
    })
    await expect(element.getByRole('checkbox')).toHaveCount(6)
    await editor.dispose()
  })

  test('a text newline keeps the checked state', async ({ page }) => {
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select(editor.end([1]))
      editor.insertText('\n')
    })
    expect(await editor.evaluate(editor => editor.children[1])).toEqual({
      type: 'check-list-item',
      checked: true,
      children: [{ text: 'Slide to the left.\n' }],
    })
    await expect(element.getByRole('checkbox')).toHaveCount(6)
    await expect(element.getByRole('checkbox').first()).toBeChecked()
    await editor.dispose()
  })

  test('typing, deleting and Enter stay in an editable checklist span', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    const item = element.locator('[data-slate-node="element"]').filter({
      hasText: 'Slide to the left.',
    })
    await item.locator('span[contenteditable="true"]').click()
    await page.waitForTimeout(200)
    await page.keyboard.press('End')
    await page.waitForTimeout(200)
    await page.keyboard.type('XYZ', { delay: 120 })
    await expect
      .poll(() => editor.evaluate(editor => editor.string([1])))
      .toBe('Slide to the left.XYZ')
    await page.keyboard.press('Backspace')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([1])))
      .toBe('Slide to the left.XY')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)
    await page.keyboard.type('new', { delay: 120 })
    await expect
      .poll(() => editor.evaluate(editor => editor.children.slice(1, 3)))
      .toEqual([
        {
          type: 'check-list-item',
          checked: true,
          children: [{ text: 'Slide to the left.XY' }],
        },
        {
          type: 'check-list-item',
          checked: false,
          children: [{ text: 'new' }],
        },
      ])
    await editor.dispose()
  })

  test('checks the bullet when clicked', async ({ page }) => {
    const slateNodeElement = 'div[data-slate-node="element"]'

    expect(await page.locator(slateNodeElement).nth(3).textContent()).toBe(
      'Criss-cross!'
    )

    await expect(
      page.locator(slateNodeElement).nth(3).locator('span').nth(1)
    ).toHaveCSS('text-decoration-line', 'line-through')

    // Unchecking the checkboxes should un-cross the corresponding text.
    await page
      .locator(slateNodeElement)
      .nth(3)
      .locator('span')
      .nth(0)
      .locator('input')
      .uncheck()
    expect(await page.locator(slateNodeElement).nth(3).textContent()).toBe(
      'Criss-cross!'
    )
    await expect(
      page.locator(slateNodeElement).nth(3).locator('span').nth(1)
    ).toHaveCSS('text-decoration-line', 'none')

    await expect(page.locator('p[data-slate-node="element"]')).toHaveCount(2)
  })
})
