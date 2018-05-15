import React from 'react'
import ReactDOM from 'react-dom/server'
import assert from 'assert'
import clean from '../helpers/clean'
import fs from 'fs-promise' // eslint-disable-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom' // eslint-disable-line import/no-extraneous-dependencies
import { Editor } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('rendering', () => {
  const dir = resolve(__dirname, './fixtures')
  const tests = fs
    .readdirSync(dir)
    .filter(t => t[0] != '.' && !!~t.indexOf('.js'))
    .map(t => basename(t, extname(t)))

  for (const test of tests) {
    it(test, async () => {
      const module = require(resolve(dir, test))
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
  }
})
