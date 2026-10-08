import React from 'react'
import { createEditor, Descendant } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'hello' }] } as Descendant,
]

const renderEditor = (container: HTMLElement) => {
  const editor = withReact(createEditor())

  act(() => {
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
      </Slate>,
      { container }
    )
  })

  const textNode = container.querySelector('[data-slate-string]')!.firstChild!
  return { editor, textNode }
}

describe('ReactEditor.findEventRange', () => {
  afterEach(() => {
    delete (document as any).caretPositionFromPoint
    delete (document as any).caretRangeFromPoint
  })

  test('passes the shadow root to caretPositionFromPoint inside shadow DOM', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const container = document.createElement('div')
    shadowRoot.appendChild(container)

    const { editor, textNode } = renderEditor(container)
    const caretPositionFromPoint = jest.fn(() => ({
      offsetNode: textNode,
      offset: 2,
      getClientRect: () => null,
    }))
    ;(document as any).caretPositionFromPoint = caretPositionFromPoint
    ;(document as any).caretRangeFromPoint = jest.fn(() => {
      const range = document.createRange()
      range.setStart(host, 0)
      return range
    })

    const range = ReactEditor.findEventRange(editor, {
      clientX: 10,
      clientY: 10,
      target: textNode.parentElement,
    })

    expect(caretPositionFromPoint).toHaveBeenCalledWith(10, 10, {
      shadowRoots: [shadowRoot],
    })
    expect(range).toEqual({
      anchor: { path: [0, 0], offset: 2 },
      focus: { path: [0, 0], offset: 2 },
    })
  })

  test('uses caretRangeFromPoint outside shadow DOM', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const { editor, textNode } = renderEditor(container)
    const caretPositionFromPoint = jest.fn()
    ;(document as any).caretPositionFromPoint = caretPositionFromPoint
    ;(document as any).caretRangeFromPoint = jest.fn(() => {
      const range = document.createRange()
      range.setStart(textNode, 3)
      range.setEnd(textNode, 3)
      return range
    })

    const range = ReactEditor.findEventRange(editor, {
      clientX: 10,
      clientY: 10,
      target: textNode.parentElement,
    })

    expect(caretPositionFromPoint).not.toHaveBeenCalled()
    expect(range).toEqual({
      anchor: { path: [0, 0], offset: 3 },
      focus: { path: [0, 0], offset: 3 },
    })
  })
})
