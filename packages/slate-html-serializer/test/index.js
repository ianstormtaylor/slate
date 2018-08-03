import Html from 'slate-html-serializer'
import assert from 'assert'
import { JSDOM } from 'jsdom'
import { Value } from 'slate'
import { fixtures } from 'slate-dev-test-utils'

describe('slate-html-serializer', () => {
  fixtures(__dirname, 'deserialize', ({ module }) => {
    const { input, output, config, options } = module
    const html = new Html({ parseHtml: JSDOM.fragment, ...config })
    const value = html.deserialize(input, options)
    const actual = Value.isValue(value) ? value.toJSON() : value
    const expected = Value.isValue(output) ? output.toJSON() : output
    assert.deepEqual(actual, expected)
  })

  fixtures(__dirname, 'serialize', ({ module }) => {
    const { input, output, rules, options } = module
    const html = new Html({ rules, parseHtml: JSDOM.fragment })
    const string = html.serialize(input, options)
    const actual = string
    const expected = output
    assert.deepEqual(actual, expected)
  })
})
