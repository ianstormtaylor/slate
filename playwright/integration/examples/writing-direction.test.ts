import { test, expect, Locator, Page } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

type Point = [block: number, offset: number | 'end']

const runEditingCommand = async (page: Page, command: string) => {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    commands: [command],
  })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp' })
  await cdp.detach()
}

const selectText = (element: Locator, anchor: Point, focus: Point) =>
  element.evaluate(
    (root, points) => {
      const blocks = root.querySelectorAll('[data-slate-node="element"]')
      const [anchorNode, anchorOffset, focusNode, focusOffset] = points.flatMap(
        ([block, offset]) => {
          const strings = blocks[block].querySelectorAll('[data-slate-string]')
          const text =
            offset === 'end'
              ? strings[strings.length - 1].firstChild!
              : strings[0].firstChild!
          return [text, offset === 'end' ? text.textContent!.length : offset]
        }
      ) as [Node, number, Node, number]
      root.ownerDocument
        .getSelection()!
        .setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset)
    },
    [anchor, focus]
  )

const selectInEditor = async (
  element: Locator,
  anchor: Point,
  focus: Point
) => {
  const editor = await getEditorHandle(element)
  await expect
    .poll(async () => {
      await selectText(element, anchor, focus)
      return editor.evaluate(
        editor =>
          editor.selection && [
            editor.selection.anchor.path[0],
            editor.selection.focus.path[0],
            JSON.stringify(editor.selection.anchor) !==
              JSON.stringify(editor.selection.focus),
          ]
      )
    })
    .toEqual([anchor[0], focus[0], true])
  await editor.dispose()
}

const selections: {
  name: string
  anchor: Point
  focus: Point
  typed: (text: string) => string
  waitForEditorSelection?: boolean
}[] = [
  {
    name: 'line the editor already has selected',
    anchor: [0, 0],
    focus: [0, 'end'],
    typed: () => 'X',
    waitForEditorSelection: true,
  },
  {
    name: 'word',
    anchor: [0, 0],
    focus: [0, 4],
    typed: text => `X${text.slice(4)}`,
  },
  {
    name: 'few characters',
    anchor: [0, 1],
    focus: [0, 3],
    typed: text => `${text[0]}X${text.slice(3)}`,
  },
  {
    name: 'selection the editor already has across styled blocks',
    anchor: [2, 0],
    focus: [3, 'end'],
    typed: () => 'X',
    waitForEditorSelection: true,
  },
]

test.describe('native writing direction command', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'Editing commands are sent through the Chrome DevTools Protocol'
    )
    await page.goto('/examples/richtext')
  })

  for (const {
    name,
    anchor,
    focus,
    typed,
    waitForEditorSelection,
  } of selections) {
    test(`keeps the editor working after it runs on a ${name}`, async ({
      page,
    }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      const element = page.getByRole('textbox')
      const paragraph = element.locator('p').first()
      const block = element
        .locator('[data-slate-node="element"]')
        .nth(anchor[0])
      const html = await element.innerHTML()
      const text = await block.innerText()
      await paragraph.click()
      if (waitForEditorSelection) {
        await selectInEditor(element, anchor, focus)
      } else {
        await selectText(element, anchor, focus)
      }

      await runEditingCommand(page, 'MakeTextWritingDirectionRightToLeft')

      expect(await element.innerHTML()).toBe(html)
      await page.keyboard.type('X')
      await expect(block).toHaveText(typed(text))
      await selectInEditor(element, [0, 0], [0, 'end'])
      await page.keyboard.press('Backspace')
      await page.keyboard.type('ab')
      await expect(paragraph).toHaveText('ab')
      expect(errors).toEqual([])
    })
  }
})
