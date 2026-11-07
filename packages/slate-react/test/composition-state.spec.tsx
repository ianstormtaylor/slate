import React from 'react'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { act, fireEvent, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, useComposing, withReact } from '../src'

Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
  get() {
    return (
      this.closest('[contenteditable]')?.getAttribute('contenteditable') ===
      'true'
    )
  },
})

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'hello world' }] } as Descendant,
]

const setup = () => {
  const editor = withReact(createEditor())
  const composing: boolean[] = []
  const ComposingProbe = () => {
    composing.push(useComposing())
    return null
  }
  const { getByRole } = render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={({ attributes, children }) => (
          <p {...attributes}>
            <ComposingProbe />
            {children}
          </p>
        )}
      />
    </Slate>
  )
  const textbox = getByRole('textbox')
  const lastComposing = () => composing[composing.length - 1]
  return { editor, textbox, lastComposing }
}

const selectDOMText = (textbox: HTMLElement, start: number, end: number) => {
  const walker = document.createTreeWalker(textbox, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node && !node.textContent?.includes('hello')) node = walker.nextNode()
  const range = document.createRange()
  range.setStart(node!, start)
  range.setEnd(node!, end)
  const selection = window.getSelection()!
  selection.removeAllRanges()
  selection.addRange(range)
  fireEvent(document, new Event('selectionchange'))
}

describe('composition state', () => {
  test('compositionstart renders as composing before the editor reports composing', async () => {
    const { editor, textbox, lastComposing } = setup()

    await act(async () => {
      fireEvent.compositionStart(textbox, { data: '' })
    })

    expect(lastComposing()).toBe(true)
    expect(ReactEditor.isComposing(editor)).toBe(false)
  })

  test('compositionupdate reports composing and compositionend clears both', async () => {
    const { editor, textbox, lastComposing } = setup()

    await act(async () => {
      fireEvent.compositionStart(textbox, { data: '' })
      fireEvent.compositionUpdate(textbox, { data: 'k' })
    })

    expect(lastComposing()).toBe(true)
    expect(ReactEditor.isComposing(editor)).toBe(true)

    await act(async () => {
      fireEvent.compositionEnd(textbox, { data: '' })
    })

    expect(lastComposing()).toBe(false)
    expect(ReactEditor.isComposing(editor)).toBe(false)
  })

  test('a keydown outside a composition clears a stuck composing state', async () => {
    const { editor, textbox, lastComposing } = setup()

    await act(async () => {
      fireEvent.compositionStart(textbox, { data: '' })
      fireEvent.compositionUpdate(textbox, { data: 'k' })
    })

    await act(async () => {
      fireEvent.keyDown(textbox, { key: 'a', isComposing: false })
    })

    expect(lastComposing()).toBe(false)
    expect(ReactEditor.isComposing(editor)).toBe(false)
  })

  test('compositionstart deletes the text the DOM has selected, not a stale editor selection', async () => {
    const { editor, textbox } = setup()

    textbox.tabIndex = 0
    await act(async () => {
      textbox.focus()
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      })
    })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    selectDOMText(textbox, 6, 11)

    await act(async () => {
      fireEvent.compositionStart(textbox, { data: '' })
    })

    expect(Editor.string(editor, [])).toBe('hello ')
  })
})
