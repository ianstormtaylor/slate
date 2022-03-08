import React from 'react'
import { createEditor, NodeEntry, Range } from 'slate'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import { Slate, withReact, DefaultEditable } from '../src'

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
    })
  })
})
