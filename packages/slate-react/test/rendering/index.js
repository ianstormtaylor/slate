import React from 'react'
import ReactDOM from 'react-dom/server'
import assert from 'assert'
import clean from '../helpers/clean'
import { JSDOM } from 'jsdom'
import { Editor } from '../..'
import { fixtures } from 'slate-dev-test-utils'

describe('rendering', () => {
  fixtures(__dirname, 'fixtures', ({ module }) => {
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
