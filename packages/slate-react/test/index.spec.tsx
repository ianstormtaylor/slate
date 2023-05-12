import React, { useEffect } from 'react'
import { createEditor, Element, Transforms } from 'slate'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import { Slate, withReact, Editable } from '../src'

const createNodeMock = () => ({
  ownerDocument: global.document,
  getRootNode: () => global.document,
})

class MockResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('slate-react', () => {
  window.ResizeObserver = MockResizeObserver as any

  describe('Editable', () => {
    describe('NODE_TO_KEY logic', () => {
      test('should not unmount the node that gets split on a split_node operation', async () => {
        const editor = withReact(createEditor())
        const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]
        const mounts = jest.fn()

        let el: ReactTestRenderer

        act(() => {
          el = create(
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
            </Slate>,
            { createNodeMock }
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

        let el: ReactTestRenderer

        act(() => {
          el = create(
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
            </Slate>,
            { createNodeMock }
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
  })
})
