import assert from 'assert'
import clean from './helpers/clean'
import React from 'react'
import ReactDOM from 'react-dom/server'
import ShallowRenderer from 'react-test-renderer/shallow'
import { Editor } from 'slate-react'
import { fixtures } from 'slate-dev-test-utils'
import { JSDOM } from 'jsdom'

describe('slate-react', () => {
  fixtures(__dirname, 'components', ({ module }) => {
    const { input, output, default: fn } = module

    const renderer = new ShallowRenderer()
    renderer.render(React.createElement(Editor, input, null))
    const editor = renderer.getRenderOutput().props.editor

    const actual = fn(editor)
    const expected = output

    assert.equal(actual, expected)
  })

  fixtures(__dirname, 'rendering/fixtures', ({ module }) => {
    const { value, output, props } = module
    const p = {
      value,
      onChange() {},
      ...(props || {}),
    }

    const string = ReactDOM.renderToStaticMarkup(<Editor {...p} />)
    const dom = JSDOM.fragment(output)
    const expected = dom.firstChild.outerHTML
      .trim()
      .replace(/\n/gm, '')
      .replace(/>\s*</g, '><')

    assert.equal(clean(string), expected)
  })
})
