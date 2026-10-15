import React from 'react'
import { createEditor } from 'slate'
import { act, fireEvent, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

jest.mock('slate-dom', () => ({
  ...jest.requireActual('slate-dom'),
  HAS_BEFORE_INPUT_SUPPORT: true,
}))

Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
  get() {
    return (
      this.closest('[contenteditable]')?.getAttribute('contenteditable') ===
      'true'
    )
  },
})

const events = [
  ['onClick', fireEvent.click],
  ['onCopy', fireEvent.copy],
  ['onBeforeInput', fireEvent.compositionEnd],
  [
    'onDOMBeforeInput',
    (element: HTMLElement, event: Record<string, unknown>) =>
      fireEvent(
        element,
        new InputEvent('beforeinput', {
          ...event,
          bubbles: true,
          inputType: 'insertText',
          data: 'X',
        })
      ),
  ],
  ['onFocus', fireEvent.focus],
  ['onBlur', fireEvent.blur],
  ['onKeyDown', fireEvent.keyDown],
  ['onPaste', fireEvent.paste],
  ['onCut', fireEvent.cut],
  ['onDragStart', fireEvent.dragStart],
  ['onDragEnd', fireEvent.dragEnd],
  ['onDragOver', fireEvent.dragOver],
  ['onDrop', fireEvent.drop],
  ['onInput', fireEvent.input],
  ['onCompositionStart', fireEvent.compositionStart],
  ['onCompositionUpdate', fireEvent.compositionUpdate],
  ['onCompositionEnd', fireEvent.compositionEnd],
] as const

describe('readOnly event handlers', () => {
  test.each(events)(
    '%s reaches the caller without editing',
    async (name, fire) => {
      const editor = withReact(createEditor())
      const handler = jest.fn()
      const children = [{ children: [{ text: 'hello' }] }]
      render(
        <Slate editor={editor} initialValue={children}>
          <Editable readOnly tabIndex={0} {...{ [name]: handler }} />
        </Slate>
      )
      const element = ReactEditor.toDOMNode(editor, editor)
      await act(async () => {
        fire(element, { key: 'Backspace', data: 'X' })
      })
      expect(handler).toHaveBeenCalledTimes(1)
      expect(editor.children).toEqual(children)
      expect(editor.operations).toEqual([])
      expect(ReactEditor.isComposing(editor)).toBe(false)
      expect(element.tabIndex).toBe(0)
    }
  )

  test('does not make readOnly viewers focusable by default', () => {
    const editor = withReact(createEditor())
    render(
      <Slate editor={editor} initialValue={[{ children: [{ text: 'hello' }] }]}>
        <Editable readOnly />
      </Slate>
    )
    expect(ReactEditor.toDOMNode(editor, editor).hasAttribute('tabindex')).toBe(
      false
    )
  })
})
