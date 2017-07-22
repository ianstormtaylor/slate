
import React from 'react'
import ReactDOM from 'react-dom/server'
import assert from 'assert'
import parse5 from 'parse5'
import fs from 'fs-promise'
import readYaml from 'read-yaml-promise'
import { Editor, Raw } from '../..'
import { resolve } from 'path'
import clean from '../helpers/clean'

/**
 * Tests.
 */

describe('rendering', () => {
  const tests = fs.readdirSync(resolve(__dirname, './fixtures'))

  for (const test of tests) {
    if (test[0] === '.') continue

    it(test, async () => {
      const dir = resolve(__dirname, './fixtures', test)
      const input = await readYaml(resolve(dir, 'input.yaml'))
      const output = await fs.readFile(resolve(dir, 'output.html'), 'utf8')
      const props = {
        state: Raw.deserialize(input, { terse: true }),
        onChange: () => {},
        ...require(dir)
      }

      const string = ReactDOM.renderToStaticMarkup(<Editor {...props} />)
      const expected = parse5.serialize(parse5.parseFragment(output))
        .trim()
        .replace(/\n/gm, '')
        .replace(/>\s*</g, '><')

      assert.equal(clean(string), expected)
    })
  }
})
