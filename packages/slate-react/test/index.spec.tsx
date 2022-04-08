// / <reference types="cypress" />

import { mount } from '@cypress/react'
import React from 'react'
import { createEditor, Transforms } from 'slate'
import {
  DefaultEditable,
  DefaultElement,
  DefaultLeaf,
  Slate,
  withReact,
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

        // const decorate = jest.fn<Range[], [NodeEntry]>(entry => [])
        const decorate = cy.stub().callsFake(() => [])

        mount(
          <Slate editor={editor} value={value} onChange={() => {}}>
            <DefaultEditable decorate={decorate} />
          </Slate>
        ).then(() => {
          expect(decorate).to.have.been.called
          expect(decorate).callCount(3)
        })
      })

      it('should rerender the part of the tree that received an updated decoration', () => {
        const editor = withReact(createEditor())

        const value = [
          { type: 'block', children: [{ text: '' }] },
          { type: 'block', children: [{ text: '' }] },
        ]

        // initial render does not return
        const decorate = cy.stub().returns([])

        const renderElement = cy.stub().returns(DefaultElement)

        const onChange = cy.stub()

        mount(
          <Slate editor={editor} value={value} onChange={onChange}>
            <DefaultEditable
              decorate={decorate}
              renderElement={renderElement}
            />
          </Slate>
        ).then(() => {
          expect(renderElement).to.have.been.calledTwice
        })

        decorate.callsFake(([node]) => {
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

        mount(
          <Slate editor={editor} value={value} onChange={onChange}>
            <DefaultEditable
              decorate={decorate}
              renderElement={renderElement}
            />
          </Slate>
        ).then(() => {
          expect(renderElement).callCount(4)
        })
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

        const decorate = cy.stub().callsFake(([node]) => {
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

        const renderLeaf = cy.stub().returns(DefaultLeaf)
        const onChange = cy.stub()

        mount(
          <Slate editor={editor} value={value} onChange={onChange}>
            <DefaultEditable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        ).then(() => {
          expect(renderLeaf).callCount(5)

          const leafs = [
            {
              leaf: { highlight: false, text: 'foo' },
            },
            {
              leaf: { highlight: false, text: 'b' },
            },
            {
              leaf: { highlight: true, text: 'ar' },
            },
            {
              leaf: { highlight: true, text: 'ba' },
            },
            {
              leaf: { highlight: false, text: 'z' },
            },
          ]
          const callargs = renderLeaf.getCalls().forEach((call, index) => {
            expect(call.args[0].leaf).to.deep.equal(leafs[index].leaf)
          })
        })
      })
    })

    describe('NODE_TO_KEY logic', () => {
      it('should not unmount the node that gets split on a split_node operation', async () => {
        const editor = withReact(createEditor())
        const value = [{ type: 'block', children: [{ text: 'test' }] }]
        const mounts = cy.stub()

        mount(
          <Slate editor={editor} value={value} onChange={() => {}}>
            <DefaultEditable
              renderElement={({ element, children }) => {
                React.useEffect(() => mounts(element), [])

                return children
              }}
            />
          </Slate>
        )
          .then(() => {
            Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 2 } })
          })
          .then(async () => {
            // 2 renders, one for the main element and one for the split element
            await expect(mounts).to.have.been.calledTwice
          })
      })

      it('should not unmount the node that gets merged into on a merge_node operation', async () => {
        const editor = withReact(createEditor())
        const value = [
          { type: 'block', children: [{ text: 'te' }] },
          { type: 'block', children: [{ text: 'st' }] },
        ]
        // const mounts = jest.fn<void, [Element]>()
        const mounts = cy.spy()

        mount(
          <Slate editor={editor} value={value} onChange={() => {}}>
            <DefaultEditable
              renderElement={({ element, children }) => {
                React.useEffect(() => mounts(element), [])

                return children
              }}
            />
          </Slate>
        )
          .then(() => {
            Transforms.mergeNodes(editor, { at: { path: [0, 0], offset: 0 } })
          })
          .then(async () => {
            // slate updates at next tick, so we need this to be async
            await expect(mounts).to.have.been.calledTwice
          })
      })
    })
  })
})
