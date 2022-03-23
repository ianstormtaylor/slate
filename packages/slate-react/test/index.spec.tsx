import React from 'react'
import { createEditor, NodeEntry, Range } from 'slate'
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

describe('slate-react', () => {
  describe('Editable', () => {
    describe('decorate', () => {
      const createNodeMock = () => ({
        ownerDocument: global.document,
        getRootNode: () => global.document,
      })

      it('should be called on all nodes in document', () => {
        const editor = withReact(createEditor())
        const value = [{ type: 'block', children: [{ text: '' }] }]

        const decorate = jest.fn<Range[], [NodeEntry]>(entry => [])

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

      it('should rerender the part of the tree that received an updated decoration', () => {
        const editor = withReact(createEditor())

        const value = [
          { type: 'block', children: [{ text: '' }] },
          { type: 'block', children: [{ text: '' }] },
        ]

        // initial render does not return
        const decorate = jest.fn<Range[], [NodeEntry]>(() => [])

        const renderElement = jest.fn<JSX.Element, [RenderElementProps]>(
          DefaultElement
        )

        const onChange = jest.fn<void, []>()

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

        // initial render does not return
        const decorate = jest.fn<Range[], [NodeEntry]>(() => [])
        const renderLeaf = jest.fn<JSX.Element, [RenderLeafProps]>(DefaultLeaf)
        const onChange = jest.fn<void, []>()

        let el: ReactTestRenderer

        act(() => {
          el = create(
            <Slate editor={editor} value={value} onChange={onChange}>
              <DefaultEditable decorate={decorate} renderLeaf={renderLeaf} />
            </Slate>,
            { createNodeMock }
          )
        })

        // 3 leaves (foo,bar,baz)
        expect(renderLeaf).toHaveBeenCalledTimes(3)
        renderLeaf.mockClear()

        // return a decoration spanning foo_b[ar_ba]z
        decorate.mockImplementation(([node]) => {
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

        act(() => {
          el.update(
            <Slate editor={editor} value={value} onChange={onChange}>
              <DefaultEditable decorate={decorate} renderLeaf={renderLeaf} />
            </Slate>
          )
        })

        // 4 rerenders, for b,ar,ba,z
        expect(renderLeaf).toHaveBeenCalledTimes(4)
        expect(renderLeaf.mock.calls).toEqual(
          expect.arrayContaining([
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
  })
})
