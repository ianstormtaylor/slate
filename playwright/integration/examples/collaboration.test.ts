import { test, expect, Locator } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

const selectEnd = async (element: Locator) => {
  await element.click()
  const editor = await getEditorHandle(element)
  await editor.evaluate(editor => editor.select(editor.end([])))
  await expect
    .poll(() =>
      element.evaluate(element => {
        const selection = window.getSelection()
        return (
          selection?.isCollapsed &&
          element.contains(selection.focusNode) &&
          selection.focusOffset === selection.focusNode?.textContent?.length
        )
      })
    )
    .toBe(true)
  await editor.dispose()
}

test.describe('collaboration example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/collaboration')
  })

  test('edits and undo sync between two editors', async ({ page }) => {
    const alice = page.getByRole('textbox', { name: "Alice's document" })
    const bob = page.getByRole('textbox', { name: "Bob's document" })
    await alice.click()
    await alice.pressSequentially('Hello')
    await expect(bob).toHaveText('Hello')
    await selectEnd(bob)
    await bob.pressSequentially(' world')
    await expect(alice).toHaveText('Hello world')
    await page.getByRole('button', { name: 'Undo Alice', exact: true }).click()
    await expect(alice).toHaveText(' world')
    await expect(bob).toHaveText(' world')
    await page.getByRole('button', { name: 'Redo Alice', exact: true }).click()
    await expect(alice).toHaveText('Hello world')
    await expect(bob).toHaveText('Hello world')
  })

  test('a new tab receives and edits the existing document', async ({
    page,
    context,
  }) => {
    const alice = page.getByRole('textbox', { name: "Alice's document" })
    await alice.click()
    await alice.pressSequentially('Shared')
    await expect(
      page.getByRole('textbox', { name: "Bob's document" })
    ).toHaveText('Shared')
    const other = await context.newPage()
    await other.goto('/examples/collaboration')
    const bob = other.getByRole('textbox', { name: "Bob's document" })
    await expect(bob).toHaveText('Shared')
    await expect(
      bob.locator(':scope > [data-slate-node="element"]')
    ).toHaveCount(1)
    await selectEnd(bob)
    await bob.pressSequentially(' across tabs')
    await expect(alice).toHaveText('Shared across tabs')
    await other.close()
    await selectEnd(alice)
    await alice.pressSequentially('!')
    await expect(
      page.getByRole('textbox', { name: "Bob's document" })
    ).toHaveText('Shared across tabs!')
  })

  test('typing works after deleting every block', async ({ page }) => {
    const alice = page.getByRole('textbox', { name: "Alice's document" })
    const bob = page.getByRole('textbox', { name: "Bob's document" })
    await alice.click()
    await alice.pressSequentially('First')
    await selectEnd(alice)
    await alice.press('Enter')
    await alice.pressSequentially('Second')
    await expect(
      bob.locator(':scope > [data-slate-node="element"]')
    ).toHaveCount(2)
    await alice.selectText()
    await alice.press('Backspace')
    await alice.pressSequentially('Again')
    await expect(alice).toHaveText('Again')
    await expect(bob).toHaveText('Again')
    await expect(
      bob.locator(':scope > [data-slate-node="element"]')
    ).toHaveCount(1)
  })
})

test('remote typing at a selection edge leaves the selected word unchanged', async ({
  page,
}) => {
  await page.goto('/examples/collaboration')
  const alice = page.getByRole('textbox', { name: "Alice's document" })
  const bob = page.getByRole('textbox', { name: "Bob's document" })
  await alice.click()
  await alice.pressSequentially('a word z')
  await expect(bob).toHaveText('a word z')
  const editor = await getEditorHandle(alice)
  const selection = {
    anchor: { path: [0, 0], offset: 2 },
    focus: { path: [0, 0], offset: 6 },
  }
  await editor.evaluate(
    (editor, selection) => editor.select(selection),
    selection
  )
  await expect
    .poll(() =>
      alice.evaluate(element => {
        const selection = element.ownerDocument.getSelection()!
        return [selection.anchorOffset, selection.focusOffset]
      })
    )
    .toEqual([2, 6])
  await selectEnd(bob)
  await bob.press('ArrowLeft')
  await bob.press('ArrowLeft')
  const bobEditor = await getEditorHandle(bob)
  await expect
    .poll(() => bobEditor.evaluate(editor => editor.selection?.focus.offset))
    .toBe(6)
  await bob.pressSequentially('X')
  await expect(alice).toHaveText('a wordX z')
  expect(await editor.evaluate(editor => editor.selection)).toEqual(selection)
  expect(
    await editor.evaluate(editor => editor.string(editor.selection!))
  ).toBe('word')
})
