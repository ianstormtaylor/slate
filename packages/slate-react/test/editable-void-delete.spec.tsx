import React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { act, fireEvent, render } from '@testing-library/react'
import { Slate, withReact, Editable, ReactEditor } from '../src'

// The keydown fallback for selected voids only runs in Chrome and Safari when
// `beforeinput` is supported, which jsdom does not report on its own.
jest.mock('slate-dom', () => ({
  ...jest.requireActual('slate-dom'),
  HAS_BEFORE_INPUT_SUPPORT: true,
  IS_WEBKIT: true,
}))

// jsdom does not implement `isContentEditable`.
Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
  get() {
    return (
      this.closest('[contenteditable]')?.getAttribute('contenteditable') ===
      'true'
    )
  },
})

describe('slate-react', () => {
  describe('Editable', () => {
    describe('deleting a selected void', () => {
      const setup = async () => {
        const editor = withReact(createEditor())
        editor.isVoid = element => (element as any).void === true

        const initialValue: Descendant[] = [
          { children: [{ text: 'one' }] },
          { void: true, children: [{ text: '' }] } as Descendant,
          { children: [{ text: 'two' }] },
        ]

        act(() => {
          render(
            <Slate editor={editor} initialValue={initialValue}>
              <Editable
                renderElement={({ attributes, children }) => (
                  <div {...attributes}>{children}</div>
                )}
              />
            </Slate>
          )
        })

        await act(async () => {
          Transforms.select(editor, { path: [1, 0], offset: 0 })
        })

        return editor
      }

      test('Delete removes the void and keeps the cursor after it', async () => {
        const editor = await setup()

        await act(async () => {
          fireEvent.keyDown(ReactEditor.toDOMNode(editor, editor), {
            key: 'Delete',
            which: 46,
          })
        })

        expect(editor.children).toEqual([
          { children: [{ text: 'one' }] },
          { children: [{ text: 'two' }] },
        ])
        expect(editor.selection).toEqual({
          anchor: { path: [1, 0], offset: 0 },
          focus: { path: [1, 0], offset: 0 },
        })
      })

      test('Backspace removes the void and moves the cursor before it', async () => {
        const editor = await setup()

        await act(async () => {
          fireEvent.keyDown(ReactEditor.toDOMNode(editor, editor), {
            key: 'Backspace',
            which: 8,
          })
        })

        expect(editor.children).toEqual([
          { children: [{ text: 'one' }] },
          { children: [{ text: 'two' }] },
        ])
        expect(editor.selection).toEqual({
          anchor: { path: [0, 0], offset: 3 },
          focus: { path: [0, 0], offset: 3 },
        })
      })
    })
  })
})
