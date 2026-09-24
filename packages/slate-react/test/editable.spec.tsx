import React, { useEffect } from 'react'
import { createEditor, Text, Transforms } from 'slate'
import { IS_COMPOSING } from 'slate-dom'
import { act, render } from '@testing-library/react'
import { Slate, withReact, Editable, ReactEditor } from '../src'

describe('slate-react', () => {
  describe('Editable', () => {
    describe('NODE_TO_KEY logic', () => {
      test('should not unmount the node that gets split on a split_node operation', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
        const mounts = jest.fn()

        act(() => {
          render(
            <Slate
              editor={editor}
              initialValue={initialValue}
              onChange={() => {}}
            >
              <Editable
                renderElement={({ children }) => {
                  useEffect(() => mounts(), [])

                  return children
                }}
              />
            </Slate>
          )
        })

        // slate updates at next tick, so we need this to be async
        await act(async () =>
          Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 2 } })
        )

        // 2 renders, one for the main element and one for the split element
        expect(mounts).toHaveBeenCalledTimes(2)
      })

      test('should not unmount the node that gets merged into on a merge_node operation', async () => {
        const editor = withReact(createEditor())
        const initialValue = [
          { type: 'block', children: [{ text: 'te' }] },
          { type: 'block', children: [{ text: 'st' }] },
        ]
        const mounts = jest.fn()

        act(() => {
          render(
            <Slate
              editor={editor}
              initialValue={initialValue}
              onChange={() => {}}
            >
              <Editable
                renderElement={({ children }) => {
                  useEffect(() => mounts(), [])

                  return children
                }}
              />
            </Slate>
          )
        })

        // slate updates at next tick, so we need this to be async
        await act(async () =>
          Transforms.mergeNodes(editor, { at: { path: [0, 0], offset: 0 } })
        )

        // only 2 renders for the initial render
        expect(mounts).toHaveBeenCalledTimes(2)
      })
    })
    test('calls onSelectionChange when editor select change', async () => {
      const editor = withReact(createEditor())
      const initialValue = [
        { type: 'block', children: [{ text: 'te' }] },
        { type: 'block', children: [{ text: 'st' }] },
      ]
      const onChange = jest.fn()
      const onValueChange = jest.fn()
      const onSelectionChange = jest.fn()

      act(() => {
        render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={onChange}
            onValueChange={onValueChange}
            onSelectionChange={onSelectionChange}
          >
            <Editable />
          </Slate>
        )
      })

      await act(async () =>
        Transforms.select(editor, { path: [0, 0], offset: 2 })
      )

      expect(onSelectionChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalled()
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('calls onValueChange when editor children change', async () => {
      const editor = withReact(createEditor())
      const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
      const onChange = jest.fn()
      const onValueChange = jest.fn()
      const onSelectionChange = jest.fn()

      act(() => {
        render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={onChange}
            onValueChange={onValueChange}
            onSelectionChange={onSelectionChange}
          >
            <Editable />
          </Slate>
        )
      })

      await act(async () => Transforms.insertText(editor, 'Hello word!'))

      expect(onValueChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalled()
      expect(onSelectionChange).not.toHaveBeenCalled()
    })

    test('calls onValueChange when editor setNodes', async () => {
      const editor = withReact(createEditor())
      const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
      const onChange = jest.fn()
      const onValueChange = jest.fn()
      const onSelectionChange = jest.fn()

      act(() => {
        render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={onChange}
            onValueChange={onValueChange}
            onSelectionChange={onSelectionChange}
          >
            <Editable />
          </Slate>
        )
      })

      await act(async () =>
        Transforms.setNodes(
          editor,
          // @ts-ignore
          { bold: true },
          {
            at: { path: [0, 0], offset: 2 },
            match: Text.isText,
            split: true,
          }
        )
      )

      expect(onChange).toHaveBeenCalled()
      expect(onValueChange).toHaveBeenCalled()
      expect(onSelectionChange).not.toHaveBeenCalled()
    })

    test('calls onValueChange when editor children change', async () => {
      const editor = withReact(createEditor())
      const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
      const onChange = jest.fn()
      const onValueChange = jest.fn()
      const onSelectionChange = jest.fn()

      act(() => {
        render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={onChange}
            onValueChange={onValueChange}
            onSelectionChange={onSelectionChange}
          >
            <Editable />
          </Slate>
        )
      })

      await act(async () => Transforms.insertText(editor, 'Hello word!'))

      expect(onValueChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalled()
      expect(onSelectionChange).not.toHaveBeenCalled()
    })

    describe('translate="no"', () => {
      test('should have translate="no" attribute', () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

        const { container } = render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={() => {}}
          >
            <Editable />
          </Slate>
        )

        const editableElement = container.querySelector('[data-slate-editor]')
        expect(editableElement?.getAttribute('translate')).toBe('no')
      })
      test('should allow override of translate attribute', () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

        const { container } = render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={() => {}}
          >
            <Editable translate="yes" />
          </Slate>
        )

        const editableElement = container.querySelector('[data-slate-editor]')
        expect(editableElement?.getAttribute('translate')).toBe('yes')
      })
    })

    test('does not throw while composing when the live DOM selection has rangeCount 0', async () => {
      const editor = withReact(createEditor())
      const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

      act(() => {
        render(
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={() => {}}
          >
            <Editable />
          </Slate>
        )
      })

      await act(async () => {
        ReactEditor.focus(editor)
      })

      expect(editor.selection).not.toBeNull()
      IS_COMPOSING.set(editor, true)

      const win = ReactEditor.getWindow(editor)
      const domSelection = win.getSelection()
      expect(domSelection).not.toBeNull()
      domSelection!.removeAllRanges()
      expect(domSelection!.rangeCount).toBe(0)

      const originalCollapseToEnd =
        domSelection!.collapseToEnd.bind(domSelection)
      domSelection!.collapseToEnd = () => {
        if (domSelection!.rangeCount === 0) {
          throw new DOMException(
            "Failed to execute 'collapseToEnd' on 'Selection': there is no selection.",
            'InvalidStateError'
          )
        }
        return originalCollapseToEnd()
      }

      await act(async () => {
        Transforms.select(editor, { path: [0, 0], offset: 2 })
      })
    })
    describe('onDrop', () => {
      const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

      // jsdom implements neither `DataTransfer` nor `caretRangeFromPoint`
      const makeDataTransfer = (text: string) =>
        ({
          getData: (type: string) => (type === 'text/plain' ? text : ''),
          setData: () => {},
        }) as unknown as DataTransfer

      const renderEditor = () => {
        const editor = withReact(createEditor())

        act(() => {
          render(
            <Slate
              editor={editor}
              initialValue={initialValue}
              onChange={() => {}}
            >
              <Editable />
            </Slate>
          )
        })

        return editor
      }

      const dispatch = async (
        editor: ReactEditor,
        type: 'dragstart' | 'drop',
        text: string
      ) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: 1,
          clientY: 1,
        })
        Object.defineProperty(event, 'dataTransfer', {
          value: makeDataTransfer(text),
        })

        await act(async () => {
          ReactEditor.toDOMNode(editor, editor).dispatchEvent(event)
        })
      }

      const resolveDropPositionTo = (node: Node, offset: number) => {
        const caretRangeFromPoint = jest.fn(() => {
          const range = document.createRange()
          range.setStart(node, offset)
          range.collapse(true)
          return range
        })
        document.caretRangeFromPoint = caretRangeFromPoint
        return caretRangeFromPoint
      }

      // A text node the browser can resolve the drop position to although the
      // event's target is the editor, e.g. after the page scrolled during the drag.
      let outside: HTMLElement | null = null
      const renderTextOutsideEditor = () => {
        outside = document.body.appendChild(document.createElement('p'))
        outside.textContent = 'outside'
        return outside.firstChild!
      }

      afterEach(() => {
        delete (document as Partial<Document>).caretRangeFromPoint
        outside?.remove()
        outside = null
      })

      test('inserts the dropped data at the drop position', async () => {
        const editor = renderEditor()
        const text = ReactEditor.toDOMNode(editor, editor).querySelector(
          '[data-slate-string]'
        )!.firstChild!
        resolveDropPositionTo(text, 2)

        await dispatch(editor, 'drop', 'drop')

        expect(editor.children).toEqual([
          { type: 'block', children: [{ text: 'tedropst' }] },
        ])
      })

      test('inserts at the selection when the drop position lies outside of the editor', async () => {
        const editor = renderEditor()
        const caretRangeFromPoint = resolveDropPositionTo(
          renderTextOutsideEditor(),
          7
        )
        await act(async () => {
          Transforms.select(editor, { path: [0, 0], offset: 2 })
        })

        await dispatch(editor, 'drop', 'drop')

        expect(caretRangeFromPoint).toHaveBeenCalled()
        expect(editor.children).toEqual([
          { type: 'block', children: [{ text: 'tedropst' }] },
        ])
      })

      test('inserts at the end when the drop position lies outside of the editor and nothing is selected', async () => {
        const editor = renderEditor()
        resolveDropPositionTo(renderTextOutsideEditor(), 7)
        expect(editor.selection).toBeNull()

        await dispatch(editor, 'drop', 'drop')

        expect(editor.children).toEqual([
          { type: 'block', children: [{ text: 'testdrop' }] },
        ])
      })

      test('leaves internally dragged content in place when the drop position lies outside of the editor', async () => {
        const editor = renderEditor()
        resolveDropPositionTo(renderTextOutsideEditor(), 7)
        await act(async () => {
          Transforms.select(editor, {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 2 },
          })
        })
        await dispatch(editor, 'dragstart', 'te')

        await dispatch(editor, 'drop', 'te')

        expect(editor.children).toEqual(initialValue)
      })
    })
  })
})
