import React from 'react'
import { createEditor } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const initialValue = [{ type: 'paragraph', children: [{ text: 'hello' }] }]

describe('ReactEditor.isMounted', () => {
  test('is false before the editor renders and true after', () => {
    const editor = withReact(createEditor())

    expect(ReactEditor.isMounted(editor)).toBe(false)

    act(() => {
      render(
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      )
    })

    expect(ReactEditor.isMounted(editor)).toBe(true)
  })
})

describe('ReactEditor.hasDOMNode', () => {
  test('returns false instead of throwing when the editor is not mounted', () => {
    const editor = withReact(createEditor())
    const target = document.createElement('div')

    expect(ReactEditor.hasDOMNode(editor, target)).toBe(false)
  })
})

describe('nested native editing hosts', () => {
  test.each(['true', '', 'plaintext-only', 'TRUE'])(
    'excludes contenteditable=%s from the outer editor',
    contentEditable => {
      const editor = withReact(createEditor())
      const { container } = render(
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      )
      const outer = container.querySelector('[data-slate-editor]')!
      const inner = document.createElement('div')
      inner.setAttribute('contenteditable', contentEditable)
      inner.textContent = 'inner'
      outer.appendChild(inner)

      expect(ReactEditor.hasDOMNode(editor, outer)).toBe(true)
      expect(ReactEditor.hasDOMNode(editor, inner)).toBe(false)
      expect(ReactEditor.hasEditableTarget(editor, inner.firstChild)).toBe(
        false
      )
      expect(ReactEditor.hasSelectableTarget(editor, inner.firstChild)).toBe(
        false
      )
    }
  )

  test('keeps readonly text and non-editable descendants inside the editor', () => {
    const editor = withReact(createEditor())
    const { container } = render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable readOnly />
      </Slate>
    )
    const outer = container.querySelector('[data-slate-editor]')!
    const text = container.querySelector('[data-slate-string]')!.firstChild!
    const nonEditable = document.createElement('div')
    nonEditable.setAttribute('contenteditable', 'false')
    outer.appendChild(nonEditable)

    expect(ReactEditor.hasDOMNode(editor, outer)).toBe(true)
    expect(ReactEditor.hasDOMNode(editor, text)).toBe(true)
    expect(ReactEditor.hasDOMNode(editor, nonEditable)).toBe(true)
  })
})
