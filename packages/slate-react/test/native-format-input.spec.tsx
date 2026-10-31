import React from 'react'
import { act, render } from '@testing-library/react'
import { createEditor, Descendant, Transforms } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from '../src'

Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
  get() {
    return (
      this.closest('[contenteditable]')?.getAttribute('contenteditable') ===
      'true'
    )
  },
})

const initialValue: Descendant[] = [
  { children: [{ text: 'one ' }, { text: 'two', bold: true } as any] },
]

const renderEditor = () => {
  const editor = withReact(createEditor())
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
  const paragraph = ReactEditor.toDOMNode(editor, editor.children[0])
  return { editor, paragraph }
}

const dispatchFormatInput = (target: HTMLElement) =>
  act(() => {
    target.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        inputType: 'formatSetBlockTextDirection',
      })
    )
  })

describe('a native format command that skips beforeinput', () => {
  test('restores wrapped text nodes so later edits render', async () => {
    const { editor, paragraph } = renderEditor()
    const html = paragraph.innerHTML
    const wrapper = document.createElement('span')
    wrapper.style.direction = 'rtl'
    wrapper.append(...Array.from(paragraph.childNodes))
    paragraph.append(wrapper)

    dispatchFormatInput(paragraph)

    expect(paragraph.innerHTML).toBe(html)
    await act(async () => {
      Transforms.delete(editor, {
        at: {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 1], offset: 3 },
        },
      })
    })
    expect(paragraph.textContent).toBe('\uFEFF')
  })

  test('restores split text and changed attributes', () => {
    const { paragraph } = renderEditor()
    const html = paragraph.innerHTML
    const string = paragraph.querySelector('[data-slate-string]')!
    const text = string.firstChild as Text
    const tail = text.splitText(2)
    const wrapper = document.createElement('span')
    wrapper.append(tail)
    string.append(wrapper)
    string.setAttribute('style', 'direction: rtl;')
    string.removeAttribute('data-slate-string')

    dispatchFormatInput(paragraph)

    expect(paragraph.innerHTML).toBe(html)
  })

  test('leaves the DOM alone for other input types', () => {
    const { paragraph } = renderEditor()
    const wrapper = document.createElement('span')
    wrapper.append(...Array.from(paragraph.childNodes))
    paragraph.append(wrapper)

    act(() => {
      paragraph.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'insertText' })
      )
    })

    expect(paragraph.firstChild).toBe(wrapper)
  })
})
