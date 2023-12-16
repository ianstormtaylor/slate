import React, { useEffect } from 'react'
import { createEditor, Text, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Slate, withReact, Editable } from '../src'

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
  })
})
