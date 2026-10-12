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
