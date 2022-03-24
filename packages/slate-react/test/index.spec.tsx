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
  DefaultElement,
} from '../src'

const createNodeMock = () => ({
  ownerDocument: global.document,
  getRootNode: () => global.document,
})

describe('slate-react', () => {
  describe('Editable', () => {
    describe('decorate', () => {
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
    })

    describe('NODE_TO_KEY logic', () => {
      it('should not unmount the node that gets split on a split_node operation', async () => {
        const editor = withReact(createEditor())
        const value = [{ type: 'block', children: [{ text: 'test' }] }]
        const mounts = jest.fn<void, [Element]>()

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

      it('should not unmount the node that gets merged into on a merge_node operation', async () => {
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
