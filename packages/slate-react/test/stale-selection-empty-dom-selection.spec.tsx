import React from 'react'
import { createEditor, Descendant, Editor } from 'slate'
import { IS_FOCUSED } from 'slate-dom'
import { act, render } from '@testing-library/react'
import { Editable, Slate, withReact } from '../src'

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'hello' }] } as Descendant,
]

describe('Editable with an empty DOM selection', () => {
  test('drops a stale selection of a focused editor without a DOM selection', () => {
    let editor!: Editor
    let container!: HTMLElement
    act(() => {
      editor = withReact(createEditor())
      ;({ container } = render(
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      ))
    })

    act(() => {
      ;(
        container.querySelector('[contenteditable="true"]') as HTMLElement
      ).focus()
    })
    IS_FOCUSED.set(editor, true)
    window.getSelection()!.removeAllRanges()

    act(() => {
      editor.selection = {
        anchor: { path: [5, 0], offset: 0 },
        focus: { path: [5, 0], offset: 0 },
      }
      editor.onChange()
    })

    expect(editor.selection).toBeNull()
  })
})
