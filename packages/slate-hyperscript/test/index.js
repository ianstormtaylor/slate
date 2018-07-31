import assert from 'assert'
import fs from 'fs'
import { Value, KeyUtils } from 'slate'
import { basename, extname, resolve } from 'path'

beforeEach(KeyUtils.resetGenerator)

describe('slate-hyperscript', () => {
  const dir = resolve(__dirname, './fixtures')
  const tests = fs
    .readdirSync(dir)
    .filter(t => t[0] != '.')
    .map(t => basename(t, extname(t)))

  for (const test of tests) {
    it(test, async () => {
      const module = require(resolve(dir, test))
      const { input, output, options } = module
      const actual = input.toJSON(options)
      const expected = Value.isValue(output) ? output.toJSON() : output
      assert.deepEqual(actual, expected)
    })
  }

  describe.skip('decorations', () => {
    const decDir = resolve(__dirname, './decorations')
    const decTests = fs
      .readdirSync(decDir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of decTests) {
      it(test, async () => {
        const module = require(resolve(decDir, test))
        const { input, output, expectDecorations } = module

        // ensure deserialization was okay
        const actual = input.toJSON()
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)

        // ensure expected properties of decorations match
        // note: they are expected to match order in test result
        expectDecorations.forEach((decoration, i) => {
          Object.keys(decoration).forEach(prop => {
            assert.deepEqual(
              decoration[prop],
              input.decorations.toJS()[i][prop],
              `decoration ${i} had incorrect prop: ${prop}`
            )
          })
        })
      })
    }
  })
})
