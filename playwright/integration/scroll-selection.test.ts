import { test, expect } from '@playwright/test'
import { getEditorHandle } from './support/editor'

for (const { container, direction, layout } of [
  { container: 'page', direction: 'above', layout: 'paragraph' },
  { container: 'page', direction: 'below', layout: 'paragraph' },
  { container: 'editor', direction: 'above', layout: 'paragraph' },
  { container: 'editor', direction: 'below', layout: 'paragraph' },
  { container: 'editor', direction: 'below', layout: 'list' },
  { container: 'editor', direction: 'below', layout: 'shadow' },
]) {
  test(`Backspace scrolls an empty ${layout} block ${direction} the ${container} viewport into view`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 })
    await page.goto(
      layout === 'shadow' ? '/examples/shadow-dom' : '/examples/richtext'
    )
    const textbox = page.getByRole('textbox')
    if (container === 'editor') {
      await textbox.evaluate(element => {
        element.style.height = '200px'
        element.style.overflowY = 'auto'
      })
    }
    await textbox.click()
    const editor = await getEditorHandle(textbox)
    const target = direction === 'below' ? 40 : 10
    await editor.evaluate(
      (editor, { target, layout }) => {
        const blocks = Array.from({ length: 60 }, () => ({
          type: layout === 'list' ? 'list-item' : 'paragraph',
          children: [{ text: '' }],
        }))
        editor.withoutNormalizing(() => {
          while (editor.children.length) editor.removeNodes({ at: [0] })
          const children =
            layout === 'list'
              ? [{ type: 'bulleted-list', children: blocks }]
              : blocks
          editor.insertNodes(children, { at: [0] })
          editor.select({
            path: layout === 'list' ? [0, target, 0] : [target, 0],
            offset: 0,
          })
        })
      },
      { target, layout }
    )
    const blocks = textbox.locator(
      layout === 'list' ? 'li' : ':scope > [data-slate-node=element]'
    )
    await expect(blocks).toHaveCount(60)
    await expect(blocks.nth(target)).toBeInViewport()
    await textbox.evaluate(
      (element, { container, direction }) => {
        const scroller = container === 'editor' ? element : window
        scroller.scrollTo(0, direction === 'below' ? 0 : element.scrollHeight)
      },
      { container, direction }
    )
    await expect(blocks.nth(target - 1)).not.toBeInViewport()
    if (layout !== 'shadow') {
      await editor.evaluate(editor => editor.onChange())
      await page.evaluate(
        () =>
          new Promise(resolve =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
          )
      )
      await expect(blocks.nth(target - 1)).not.toBeInViewport()
    }

    await page.keyboard.press('Backspace')

    await expect(blocks).toHaveCount(59)
    await expect
      .poll(() => editor.evaluate(editor => editor.selection))
      .toEqual({
        anchor: {
          path: layout === 'list' ? [0, target - 1, 0] : [target - 1, 0],
          offset: 0,
        },
        focus: {
          path: layout === 'list' ? [0, target - 1, 0] : [target - 1, 0],
          offset: 0,
        },
      })
    await expect(blocks.nth(target - 1)).toBeInViewport()
    await expect
      .poll(() =>
        textbox.evaluate((element, container) => {
          const root = element.getRootNode()
          const selection =
            'getSelection' in root && typeof root.getSelection === 'function'
              ? root.getSelection()
              : window.getSelection()
          let range = selection!.getRangeAt(0)
          if (
            root instanceof ShadowRoot &&
            !element.contains(range.startContainer)
          ) {
            const shadowSelection = selection as Selection & {
              getComposedRanges: (options: {
                shadowRoots: ShadowRoot[]
              }) => StaticRange[]
            }
            const [composed] = shadowSelection.getComposedRanges({
              shadowRoots: [root],
            })
            range = document.createRange()
            range.setStart(composed.startContainer, composed.startOffset)
            range.collapse(true)
          }
          const rect = range.getBoundingClientRect()
          const viewport =
            container === 'editor'
              ? element.getBoundingClientRect()
              : { top: 0, bottom: innerHeight }
          return (
            rect.height > 0 &&
            rect.top >= viewport.top - 1 &&
            rect.bottom <= viewport.bottom + 1
          )
        }, container)
      )
      .toBe(true)
    await editor.dispose()
  })
}

test('native line movement calls custom scrolling below a sticky header', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Desktop keyboard navigation')
  await page.setViewportSize({ width: 800, height: 600 })
  await page.goto('/playwright/scroll-selection')
  const textbox = page.getByRole('textbox')
  await textbox.click()
  const editor = await getEditorHandle(textbox)
  const text = await textbox.innerText()
  const offset = text.indexOf('Line 20:')
  await editor.evaluate(
    (editor, offset) => editor.select({ path: [0, 0], offset }),
    offset
  )
  await expect
    .poll(() => textbox.evaluate(() => window.getSelection()?.focusOffset))
    .toBe(offset)
  await page.evaluate(() =>
    window.scrollBy(
      0,
      window.getSelection()!.getRangeAt(0).getBoundingClientRect().top - 105
    )
  )
  const counter = page.getByTestId('scroll-calls')
  let before = Number(await counter.getAttribute('data-count'))
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowUp')
    await expect
      .poll(async () => Number(await counter.getAttribute('data-count')))
      .toBeGreaterThan(before)
    before = Number(await counter.getAttribute('data-count'))
  }
  await expect
    .poll(() =>
      page.evaluate(
        () => window.getSelection()!.getRangeAt(0).getBoundingClientRect().top
      )
    )
    .toBeGreaterThanOrEqual(79)
  await editor.dispose()
})
