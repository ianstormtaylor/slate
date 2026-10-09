import React from 'react'
import { createEditor, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Slate, withReact, Editable, ReactEditor } from '../src'

describe('slate-react', () => {
  describe('ReactEditor', () => {
    describe('.focus', () => {
      test('should set focus in top of document with no editor selection', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
        const testSelection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        }

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

        expect(editor.selection).toEqual(testSelection)

        await act(async () => {
          const windowSelection = ReactEditor.getWindow(editor).getSelection()
          expect(windowSelection?.focusNode?.textContent).toBe('test')
          expect(windowSelection?.anchorNode?.textContent).toBe('test')
          expect(windowSelection?.anchorOffset).toBe(
            testSelection.anchor.offset
          )
          expect(windowSelection?.focusOffset).toBe(testSelection.focus.offset)
        })
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

      test('should not trigger onValueChange when focus is called', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
        const onChange = jest.fn()
        const onValueChange = jest.fn()
        const onSlectionChange = jest.fn()

        act(() => {
          render(
            <Slate
              editor={editor}
              initialValue={initialValue}
              onValueChange={onValueChange}
              onChange={onChange}
              onSelectionChange={onSlectionChange}
            >
              <Editable />
            </Slate>
          )
        })

        expect(editor.selection).toBe(null)

        await act(async () => {
          ReactEditor.focus(editor)
        })

        expect(editor.selection).toEqual({
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        })

        expect(onChange).toHaveBeenCalled()
        expect(onSlectionChange).toHaveBeenCalled()
        expect(onValueChange).not.toHaveBeenCalled()
      })
    })

    describe('.findEventRange', () => {
      const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

      let outside: HTMLElement | null = null

      afterEach(() => {
        outside?.remove()
        outside = null
      })

      const renderEditorAndOutsideTarget = () => {
        const editor = withReact(createEditor())

        act(() => {
          render(
            <Slate editor={editor} initialValue={initialValue}>
              <Editable />
            </Slate>
          )
        })

        outside = document.body.appendChild(document.createElement('p'))
        const event = { clientX: 1, clientY: 1, target: outside }

        return { editor, event }
      }

      test('should return null for a target outside of the editor with suppressThrow', () => {
        const { editor, event } = renderEditorAndOutsideTarget()

        expect(
          ReactEditor.findEventRange(editor, event, { suppressThrow: true })
        ).toBeNull()
      })

      test('should throw for a target outside of the editor without suppressThrow', () => {
        const { editor, event } = renderEditorAndOutsideTarget()

        expect(() => ReactEditor.findEventRange(editor, event)).toThrow(
          'Cannot resolve a Slate node from DOM node'
        )
      })
    })
  })
})
