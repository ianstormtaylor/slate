import React from 'react'
import { createEditor, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Slate, withReact, Editable, ReactEditor } from '../src'

describe('slate-react', () => {
  describe('ReactEditor', () => {
    describe('.focus', () => {
      test('should focus with no editor selection', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

        act(() => {
          render(
            <Slate editor={editor} initialValue={initialValue}>
              <Editable />
            </Slate>
          )
        })

        expect(editor.selection).toBe(null)

        await act(async () => {
          ReactEditor.focus(editor)
        })

        expect(ReactEditor.isFocused(editor)).toBe(true)
      })

      test('should be able to call .focus without getting toDOMNode errors', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
        const propagatedValue = [
          { type: 'block', children: [{ text: 'foo' }] },
          { type: 'block', children: [{ text: 'bar' }] },
        ]

        const testSelection = {
          anchor: { path: [1, 0], offset: 0 },
          focus: { path: [1, 0], offset: 3 },
        }

        act(() => {
          render(
            <Slate editor={editor} initialValue={initialValue}>
              <Editable />
            </Slate>
          )
        })

        await act(async () => {
          Transforms.removeNodes(editor, { at: [0] })
          Transforms.insertNodes(editor, propagatedValue)
          ReactEditor.focus(editor) // Note: calling focus in the middle of these transformations.
          Transforms.select(editor, testSelection)
        })

        expect(editor.selection).toEqual(testSelection)

        await act(async () => {
          ReactEditor.focus(editor)
        })

        await act(async () => {
          const windowSelection = ReactEditor.getWindow(editor).getSelection()
          expect(windowSelection?.focusNode?.textContent).toBe('bar')
          expect(windowSelection?.anchorNode?.textContent).toBe('bar')
          expect(windowSelection?.anchorOffset).toBe(
            testSelection.anchor.offset
          )
          expect(windowSelection?.focusOffset).toBe(testSelection.focus.offset)
        })
      })

      test('should restore DOM selection when focusing inside a shadow root', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
        const host = document.createElement('div')
        const shadowRoot = host.attachShadow({ mode: 'open' })
        const container = document.createElement('div')
        const shadowSelection = {
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
          rangeCount: 0,
        }

        shadowRoot.appendChild(container)
        document.body.appendChild(host)
        shadowRoot.getSelection = jest.fn(() => shadowSelection as any)

        act(() => {
          render(
            <Slate editor={editor} initialValue={initialValue}>
              <Editable />
            </Slate>,
            { container }
          )
        })

        editor.selection = {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 0], offset: 1 },
        }

        await act(async () => {
          ReactEditor.focus(editor)
        })

        expect(shadowRoot.getSelection).toHaveBeenCalled()
        expect(ReactEditor.isFocused(editor)).toBe(true)
      })
    })
  })
})
