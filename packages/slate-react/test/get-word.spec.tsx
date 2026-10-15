import React from 'react'
import { createEditor, Descendant, Editor } from 'slate'
import { IS_COMPOSING } from 'slate-dom'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const setup = (text: string) => {
  const editor = withReact(createEditor())
  const initialValue = [
    { type: 'paragraph', children: [{ text }] } as Descendant,
  ]
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
  return editor
}

const domText = (editor: ReactEditor) => {
  const [text] = Editor.nodes(editor, { at: [0, 0] })
  const element = ReactEditor.toDOMNode(editor, text[0])
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  return walker.nextNode() as globalThis.Text
}

describe('ReactEditor.getWord', () => {
  test('matches Editor.word when nothing is being composed', () => {
    const editor = setup('hello world')
    editor.selection = {
      anchor: { path: [0, 0], offset: 8 },
      focus: { path: [0, 0], offset: 8 },
    }

    expect(ReactEditor.getWord(editor)).toEqual({
      range: Editor.word(editor),
      text: 'world',
    })
  })

  test('includes text that is still being composed', () => {
    const editor = setup('hello wor')
    const node = domText(editor)

    act(() => {
      IS_COMPOSING.set(editor, true)
      node.textContent = 'hello world'
      document.getSelection()!.collapse(node, 11)
    })

    expect(ReactEditor.getWord(editor)?.text).toBe('world')
    expect(
      Editor.string(
        editor,
        Editor.word(editor, { at: { path: [0, 0], offset: 9 } })!
      )
    ).toBe('wor')
    IS_COMPOSING.set(editor, false)
  })
})
