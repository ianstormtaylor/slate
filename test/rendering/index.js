
import React from 'react'
import ReactDOM from 'react-dom/server'
import assert from 'assert'
import cheerio from 'cheerio'
import fs from 'fs-promise'
import readYaml from 'read-yaml-promise'
import { Editor, Raw } from '../..'
import { resolve } from 'path'

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
      const expected = cheerio
        .load(output)
        .html()
        .trim()
        .replace(/\n/gm, '')
        .replace(/>\s*</g, '><')

      assert.equal(clean(string), expected)
    })
  }
})

/**
 * Clean a renderer `html` string, removing dynamic attributes.
 *
 * @param {String} html
 * @return {String}
 */

function clean(html) {
  const $ = cheerio.load(html)

  $('*').each((i, el) => {
    $(el).removeAttr('data-key')
    $(el).removeAttr('data-offset-key')
  })

  $.root().children().removeAttr('spellcheck')
  $.root().children().removeAttr('style')

  return $.html()
}
