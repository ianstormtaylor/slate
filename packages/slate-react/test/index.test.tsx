import React from 'react'
import {
  createEditor,
  NodeEntry,
  Node,
  Range,
  Element,
  Transforms,
} from 'slate'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import {
  Slate,
  withReact,
  DefaultEditable,
  RenderElementProps,
  RenderLeafProps,
  DefaultElement,
  DefaultLeaf,
} from '../src'
import { vi, test, describe, expect } from 'vitest'

const createNodeMock = () => ({
  ownerDocument: global.document,
  getRootNode: () => global.document,
})

describe('slate-react', () => {
  describe('Editable', () => {
    describe('decorate', () => {
      test('should be called on all nodes in document', () => {
        const editor = withReact(createEditor())
        const value = [{ type: 'block', children: [{ text: '' }] }]

        const decorate = vi.fn<Range[], [NodeEntry]>(entry => [])

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={() => {}}>
              <DefaultEditable decorate={decorate} />
            </Slate>,
            { createNodeMock }
          )
        })

        expect(decorate).toHaveBeenCalledTimes(3)
      })

      test('should rerender the part of the tree that received an updated decoration', () => {
        const editor = withReact(createEditor())

        const value = [
          { type: 'block', children: [{ text: '' }] },
          { type: 'block', children: [{ text: '' }] },
        ]

        // initial render does not return
        const decorate = vi.fn<Range[], [NodeEntry]>(() => [])

        const renderElement = vi.fn<JSX.Element, [RenderElementProps]>(
          DefaultElement
        )

        const onChange = vi.fn<void, []>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={onChange}>
              <DefaultEditable
                decorate={decorate}
                renderElement={renderElement}
              />
            </Slate>,
            { createNodeMock }
          )
        })

        expect(renderElement).toHaveBeenCalledTimes(2)

        decorate.mockImplementation(([node]) => {
          if (node !== value[0].children[0]) {
            return []
          }

          return [
            {
              anchor: { path: [0, 0], offset: 0 },
              focus: { path: [0, 0], offset: 0 },
            },
          ]
        })

        act(() => {
          el.update(
            <Slate editor={editor} value={value} onChange={onChange}>
              <DefaultEditable
                decorate={decorate}
                renderElement={renderElement}
              />
            </Slate>
          )
        })

        expect(renderElement).toHaveBeenCalledTimes(3)
      })

      test('should pass the intersecting part of decorations to nested elements', () => {
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

        const decorate = vi.fn<Range[], [NodeEntry]>(([node]) => {
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

        const renderLeaf = vi.fn<JSX.Element, [RenderLeafProps]>(DefaultLeaf)
        const onChange = vi.fn<void, []>()
        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={onChange}>
              <DefaultEditable decorate={decorate} renderLeaf={renderLeaf} />
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
        const mounts = vi.fn<void, [Element]>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={() => {}}>
              <DefaultEditable
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
        const mounts = vi.fn<void, [Element]>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={() => {}}>
              <DefaultEditable
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
