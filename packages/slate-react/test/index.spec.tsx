import React from 'react'
import { createEditor, NodeEntry, Range, Element, Transforms } from 'slate'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import {
  Slate,
  withReact,
  Editable,
  DefaultLeaf,
  DefaultElement,
  RenderElementProps,
  RenderLeafProps,
} from '../src'

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
    describe('decorate', () => {
      it('should be called on all nodes in document', () => {
        const editor = withReact(createEditor())
        const value = [{ type: 'block', children: [{ text: '' }] }]

        const decorate = jest.fn<Range[], [NodeEntry]>(() => [])

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={() => {}}>
              <Editable decorate={decorate} />
            </Slate>,
            { createNodeMock }
          )
        })

        expect(decorate).toHaveBeenCalledTimes(3)
      })

      it('should rerender the nodes of the tree that received an updated decoration', () => {
        const editor = withReact(createEditor())

        const value = [
          { type: 'block', children: [{ text: 'foo' }] },
          { type: 'block', children: [{ text: 'bar' }] },
        ]

        let decorate = jest.fn<Range[], [NodeEntry]>(() => [])
        const renderElement = jest.fn<JSX.Element, [RenderElementProps]>(
          DefaultElement
        )
        const renderLeaf = jest.fn<JSX.Element, [RenderLeafProps]>(DefaultLeaf)

        const onChange = jest.fn<void, []>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={onChange}>
              <Editable
                decorate={decorate}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Slate>,
            { createNodeMock }
          )
        })

        expect(renderElement).toHaveBeenCalledTimes(2)
        expect(renderLeaf).toHaveBeenCalledTimes(2)

        renderElement.mockClear()
        renderLeaf.mockClear()

        decorate = jest.fn<Range[], [NodeEntry]>(([node]) => {
          if (node !== value[0].children[0]) {
            return []
          }

          return [
            {
              anchor: { path: [0, 0], offset: 0 },
              focus: { path: [0, 0], offset: 3 },
              highlight: true,
            },
          ]
        })

        act(() => {
          el.update(
            <Slate editor={editor} value={value} onChange={onChange}>
              <Editable
                decorate={decorate}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Slate>
          )
        })

        expect(renderElement).toHaveBeenCalledTimes(0)
        expect(renderLeaf).toHaveBeenCalledTimes(1)
      })

      it('should pass the intersecting part of decorations to nested elements', () => {
        const editor = withReact(createEditor())

        const value = [
          {
            type: 'parent',
            children: [
              { type: 'block', children: [{ text: 'foo', highlight: false }] },
              { type: 'block', children: [{ text: 'bar', highlight: false }] },
              { type: 'block', children: [{ text: 'baz', highlight: false }] },
            ],
          },
        ]

        const decorate = jest.fn<Range[], [NodeEntry]>(([node, p]) => {
          if (node !== value[0]) {
            return []
          }
          return [
            {
              anchor: { path: [0, 1, 0], offset: 1 },
              focus: { path: [0, 2, 0], offset: 2 },
              highlight: true,
            },
          ]
        })

        const renderLeaf = jest.fn<JSX.Element, [RenderLeafProps]>(DefaultLeaf)
        const onChange = jest.fn<void, []>()
        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={onChange}>
              <Editable decorate={decorate} renderLeaf={renderLeaf} />
            </Slate>,
            { createNodeMock }
          )
        })

        // 4 renders, for foo,b,ar,ba,z
        expect(renderLeaf).toHaveBeenCalledTimes(5)
        expect(renderLeaf.mock.calls).toEqual(
          expect.arrayContaining([
            [
              expect.objectContaining({
                leaf: { highlight: false, text: 'foo' },
              }),
            ],
            [
              expect.objectContaining({
                leaf: { highlight: false, text: 'b' },
              }),
            ],
            [
              expect.objectContaining({
                leaf: { highlight: true, text: 'ar' },
              }),
            ],
            [
              expect.objectContaining({
                leaf: { highlight: true, text: 'ba' },
              }),
            ],
            [
              expect.objectContaining({
                leaf: { highlight: false, text: 'z' },
              }),
            ],
          ])
        )
      })
    })

    describe('NODE_TO_KEY logic', () => {
      test('should not unmount the node that gets split on a split_node operation', async () => {
        const editor = withReact(createEditor())
        const value = [{ type: 'block', children: [{ text: 'test' }] }]
        const mounts = jest.fn<void, [Element]>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={() => {}}>
              <Editable
                renderElement={({ element, children }) => {
                  React.useEffect(() => mounts(element), [])

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
        const value = [
          { type: 'block', children: [{ text: 'te' }] },
          { type: 'block', children: [{ text: 'st' }] },
        ]
        const mounts = jest.fn<void, [Element]>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={() => {}}>
              <Editable
                renderElement={({ element, children }) => {
                  React.useEffect(() => mounts(element), [])

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
