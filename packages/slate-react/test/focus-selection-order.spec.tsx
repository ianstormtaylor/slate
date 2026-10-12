import React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'hello world' }] } as Descendant,
]

describe('ReactEditor.focus', () => {
  test('restores the DOM selection after focusing the editable', async () => {
    const editor = withReact(createEditor())

    act(() => {
      render(
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      )
    })

    await act(async () => {
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 6 },
        focus: { path: [0, 0], offset: 6 },
      })
    })

    const el = ReactEditor.toDOMNode(editor, editor)
    const calls: string[] = []
    const focus = jest
      .spyOn(el, 'focus')
      .mockImplementation(() => calls.push('focus'))
    const addRange = jest
      .spyOn(Selection.prototype, 'addRange')
      .mockImplementation(() => calls.push('addRange'))

    ReactEditor.focus(editor)

    expect(calls).toEqual(['focus', 'addRange'])
    focus.mockRestore()
    addRange.mockRestore()
  })
})
