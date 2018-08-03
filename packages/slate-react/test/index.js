import AfterPlugin from '../src/plugins/after'
import assert from 'assert'
import BeforePlugin from '../src/plugins/before'
import clean from './helpers/clean'
import React from 'react'
import ReactDOM from 'react-dom/server'
import Simulator from 'slate-simulator'
import { Editor } from 'slate-react'
import { fixtures } from 'slate-dev-test-utils'
import { JSDOM } from 'jsdom'

describe('slate-react', () => {
  fixtures.skip(__dirname, 'plugins', ({ module }) => {
    const { input, output, props = {} } = module
    const fn = module.default
    const plugins = [BeforePlugin(props), AfterPlugin(props)]
    const simulator = new Simulator({ plugins, value: input })
    fn(simulator)

    const actual = simulator.value.toJSON({ preserveSelection: true })
    const expected = output.toJSON({ preserveSelection: true })
    assert.deepEqual(actual, expected)
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
