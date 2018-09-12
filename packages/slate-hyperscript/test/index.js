/**
 * Dependencies.
 */

import assert from 'assert'
import fs from 'fs'
import { Value } from '@gitbook/slate'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('slate-hyperscript', () => {
  describe('default settings', () => {
    const dir = resolve(__dirname, './default')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output } = module

        const actual = input.toJSON()
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)
        if (module.test) module.test()
      })
    }
  })

  describe('custom tags', () => {
    const dir = resolve(__dirname, './custom')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output } = module

        const actual = input.toJSON()
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)
      })
    }
  })

  describe('selections', () => {
    const dir = resolve(__dirname, './selections')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, expectSelection } = module

        // ensure deserialization was okay
        const actual = input.toJSON()
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)

        // ensure expected properties of selection match
        Object.keys(expectSelection).forEach(prop => {
          assert.equal(input.selection[prop], expectSelection[prop])
        })
      })
    }
  })

  describe('decorations', () => {
    const dir = resolve(__dirname, './decorations')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
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

  describe('normalize', () => {
    const dir = resolve(__dirname, './normalize')
    const tests = fs
      .readdirSync(dir)
      .filter(t => t[0] != '.')
      .map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output } = module

        const actual = Value.isValue(input) ? input.toJSON() : input
        const expected = Value.isValue(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)
      })
    }
  })
})
