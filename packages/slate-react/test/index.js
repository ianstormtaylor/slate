import * as Slate from 'slate'
import * as SlateReact from '..'
import { JSDOM } from 'jsdom'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import assert from 'assert'

describe('slate-react', () => {
  describe('Editable', () => {
    describe('decorate', () => {
      // stub out some DOM stuff to avoid crashes
      before(() => {
        const jsdom = new JSDOM()
        global.window = jsdom.window
        global.document = jsdom.window.document
        global.Document = document.constructor
      })

      const createNodeMock = () => ({
        ownerDocument: global.document,
        getRootNode: () => global.document,
      })

      it('should be called on all nodes in document', () => {
        const editor = SlateReact.withReact(Slate.createEditor())
        const value = [{ type: 'block', children: [{ text: '' }] }]
        let count = 0
        const decorate = ([node, path]) => {
          count++
          return []
        }

        const el = React.createElement(
          SlateReact.Slate,
          { editor, value },
          React.createElement(SlateReact.Editable, { decorate })
        )

        TestRenderer.create(el, { createNodeMock })

        // editor, block, text
        assert.strictEqual(count, 3)
      })
    })
  })
})
