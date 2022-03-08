import React from 'react'
import { createEditor, NodeEntry, Range } from 'slate'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import {
  Slate,
  withReact,
  DefaultEditable,
  RenderElementProps,
  DefaultElement,
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
    })
  })
})
