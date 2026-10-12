import React from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { render, act } from '@testing-library/react'
import { Slate, withReact, Editable } from '../src'

describe('an empty initialValue', () => {
  it('loads one empty block so the editor can hold a cursor and take input', () => {
    const editor = withReact(createEditor())
    render(
      <Slate editor={editor} initialValue={[]}>
        <Editable />
      </Slate>
    )

    expect(editor.children).toEqual([{ children: [{ text: '' }] }])

    act(() => {
      Transforms.select(editor, Editor.start(editor, []))
      editor.insertText('typed')
    })

    expect(Editor.string(editor, [])).toBe('typed')
  })

  it('keeps a non-empty initialValue as given', () => {
    const editor = withReact(createEditor())
    const initialValue = [{ children: [{ text: 'kept' }] }]
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
      </Slate>
    )

    expect(editor.children).toBe(initialValue)
  })
})
