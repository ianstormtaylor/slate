
import React from 'react'
import ReactDOM from 'react-dom/server'
import assert from 'assert'
import clean from '../helpers/clean'
import fs from 'fs-promise'
import { Editor } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('plugins', () => {
  const dir = resolve(__dirname, './fixtures')
  const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

  for (const test of tests) {
    it(test, async () => {
      const module = require(resolve(dir, test))
      const { state, output, plugins } = module
      const props = {
        state,
        plugins,
        onChange: () => {},
      }

      const string = ReactDOM.renderToStaticMarkup(<Editor {...props} />)
      const expected = output
        .trim()
        .replace(/\n/gm, '')
        .replace(/>\s*</g, '><')

      assert.equal(clean(string), expected)
    })
  }
})
