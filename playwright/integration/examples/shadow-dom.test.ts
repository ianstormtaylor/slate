import { test, expect, Locator } from '@playwright/test'
import { clearEditor, getEditorHandle } from '../support/editor'

/**
 * Replays the DOM side of a macOS composition at the caret of an editor in a
 * shadow root, since macOS input methods can't reach Playwright's WebKit. Each
 * string in `composing` replaces the composition text, with `compositionupdate`
 * and `insertCompositionText` events, then the replay waits for Slate's
 * throttled `selectionchange` handler. `commit` ends the composition the way
 * WebKit does, with `deleteCompositionText`, a cancelable
 * `insertFromComposition` and `compositionend`.
 *
 * WebKit cancels a composition when script rewrites the composition text or
 * moves the caret out of it. If that happens, the replay fires `compositionend`
 * and returns `{ cancelled: true }`. The events are untrusted and have no
 * target ranges.
 */
const composeLikeWebKit = (
  editable: Locator,
  { composing, commit }: { composing: string[]; commit?: string }
) =>
  editable.evaluate(
    async (editable, { composing, commit }) => {
      const root = editable.getRootNode()

      if (!(root instanceof ShadowRoot)) {
        throw new Error('The editor must be inside a shadow root')
      }

      const selection = document.getSelection()!
      // In WebKit, only `getComposedRanges()` exposes the caret inside a
      // shadow root.
      const caret = () =>
        selection.getComposedRanges({ shadowRoots: [root] })[0] ?? null
      const start = caret()

      if (!start?.collapsed || !(start.startContainer instanceof Text)) {
        throw new Error('The selection must be collapsed in a text node')
      }

      const textNode = start.startContainer
      const offset = start.startOffset
      let compositionText = ''
      const compositionIsIntact = () => {
        const end = caret()
        const endOffset = offset + compositionText.length
        return (
          textNode.isConnected &&
          textNode.data.slice(offset, endOffset) === compositionText &&
          end?.collapsed &&
          end.startContainer === textNode &&
          end.startOffset === endOffset
        )
      }
      const fire = (event: Event) => editable.dispatchEvent(event)
      const compositionEvent = (type: string, data: string) =>
        new CompositionEvent(type, { bubbles: true, composed: true, data })
      const inputEvent = (
        type: 'beforeinput' | 'input',
        inputType: string,
        data: string | null,
        cancelable = false
      ) =>
        new InputEvent(type, {
          bubbles: true,
          composed: true,
          cancelable,
          inputType,
          data,
          isComposing: true,
        })

      fire(compositionEvent('compositionstart', ''))

      for (const text of composing) {
        fire(compositionEvent('compositionupdate', text))
        fire(inputEvent('beforeinput', 'insertCompositionText', text))
        textNode.replaceData(offset, compositionText.length, text)
        compositionText = text
        selection.collapse(textNode, offset + text.length)
        fire(inputEvent('input', 'insertCompositionText', text))
        // Wait longer than Slate's 100 ms `selectionchange` throttle.
        await new Promise(resolve => setTimeout(resolve, 200))

        if (!compositionIsIntact()) {
          fire(compositionEvent('compositionend', ''))
          return { cancelled: true }
        }
      }

      if (commit === undefined) {
        return { cancelled: false }
      }

      fire(inputEvent('beforeinput', 'deleteCompositionText', null))
      textNode.deleteData(offset, compositionText.length)
      selection.collapse(textNode, offset)
      fire(inputEvent('input', 'deleteCompositionText', null))

      const insert = inputEvent(
        'beforeinput',
        'insertFromComposition',
        commit,
        true
      )
      fire(insert)

      if (!insert.defaultPrevented) {
        textNode.insertData(offset, commit)
        selection.collapse(textNode, offset + commit.length)
        fire(inputEvent('input', 'insertFromComposition', commit))
      }

      fire(compositionEvent('compositionend', commit))
      return { cancelled: false }
    },
    { composing, commit }
  )

test.describe('shadow-dom example', () => {
  test.beforeEach(async ({ page }) => await page.goto('/examples/shadow-dom'))

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

    await expect(textbox).toHaveCount(1)
    await clearEditor(textbox)
    await page.keyboard.type('Hello, Playwright!')
    await expect(textbox).toHaveText('Hello, Playwright!')
  })

  test('user can type add a new line in editor inside shadow DOM', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    const pageErrors: Error[] = []
    page.on('pageerror', error => {
      pageErrors.push(error)
    })

    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')

    await textbox.click()
    await page.keyboard.press('Enter')
    await page.keyboard.type('New line text')

    expect(consoleErrors, 'Console errors occurred').toEqual([])
    expect(pageErrors, 'Page errors occurred').toEqual([])

    await expect(textbox).toContainText('New line text')
  })

  const compositions = [
    // Option+E, then o
    {
      name: 'a dead-key accent',
      before: 'C',
      composing: ['´'],
      commit: 'ó',
      after: 'mo',
    },
    // Japanese Romaji input: kanji, Space, Return
    {
      name: 'a Japanese conversion',
      before: 'A',
      composing: ['ｋ', 'か', 'かｎ', 'かんｊ', 'かんじ', '漢字'],
      commit: '漢字',
      after: 'b',
    },
  ]

  for (const { name, before, composing, commit, after } of compositions) {
    test(`keeps ${name} and the letters after it in WebKit`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== 'webkit', 'Replays WebKit composition events')
      const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
      const innerShadow = outerShadow.locator('> div')
      const textbox = innerShadow.getByRole('textbox')
      const editor = await getEditorHandle(textbox)
      const text = before + commit + after

      await clearEditor(textbox)
      await page.keyboard.type(before)
      await expect(textbox).toHaveText(before)

      expect(await composeLikeWebKit(textbox, { composing, commit })).toEqual({
        cancelled: false,
      })
      await page.keyboard.type(after)

      await expect(textbox).toHaveText(text)
      expect(await editor.evaluate(editor => editor.string([]))).toBe(text)
      expect(await editor.evaluate(editor => editor.selection)).toEqual({
        anchor: { path: [0, 0], offset: text.length },
        focus: { path: [0, 0], offset: text.length },
      })
    })
  }

  test('types where you click after blurring mid-composition in WebKit', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'webkit', 'Replays WebKit composition events')
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')
    const editor = await getEditorHandle(textbox)

    await clearEditor(textbox)
    await page.keyboard.type('Hello')
    await expect(textbox).toHaveText('Hello')

    // Option+E, with no letter after it
    expect(await composeLikeWebKit(textbox, { composing: ['´'] })).toEqual({
      cancelled: false,
    })

    // On blur, Slate removes the selection and WebKit drops the composition
    // without a `compositionend` event, so the test doesn't fire one.
    const link = page.getByRole('link', { name: 'GitHub' })
    await link.focus()
    await expect(link).toBeFocused()

    const text = textbox.locator('[data-slate-string]')
    const box = (await text.boundingBox())!
    await page.mouse.click(box.x + 1, box.y + box.height / 2)
    await page.keyboard.type('Oh ')

    await expect(textbox).toHaveText('Oh Hello')
    expect(await editor.evaluate(editor => editor.string([]))).toBe('Oh Hello')
  })
})
