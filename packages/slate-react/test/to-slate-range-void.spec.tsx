import React from 'react'
import { createEditor, Descendant, Editor } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'before the void' }] } as Descendant,
  { type: 'image', children: [{ text: '' }] } as Descendant,
]

const renderEditor = () => {
  const editor = withReact(createEditor())
  const { isVoid } = editor
  editor.isVoid = element =>
    (element as { type?: string }).type === 'image' || isVoid(element)

  const { container } = render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={({ attributes, children, element }) =>
          (element as { type?: string }).type === 'image' ? (
            <div {...attributes}>
              <div contentEditable={false} data-testid="void-content">
                image
              </div>
              {children}
            </div>
          ) : (
            <p {...attributes}>{children}</p>
          )
        }
      />
    </Slate>
  )

  return { editor, container }
}

describe('ReactEditor.toSlateRange', () => {
  test('keeps a forward selection that ends inside a block void', () => {
    let editor!: Editor
    let container!: HTMLElement
    act(() => {
      ;({ editor, container } = renderEditor())
    })

    const text = container.querySelector('[data-slate-string]')!.firstChild!
    const voidContent = container.querySelector('[data-testid="void-content"]')!
    const domRange = document.createRange()
    domRange.setStart(text, 0)
    domRange.setEnd(voidContent, 0)

    const range = ReactEditor.toSlateRange(editor as ReactEditor, domRange, {
      exactMatch: false,
      suppressThrow: false,
    })

    expect(range).toEqual({
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [1, 0], offset: 0 },
    })
  })
})
