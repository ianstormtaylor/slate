
import assert from 'assert'
import fs from 'fs'
import parse5 from 'parse5'
import { Plain, State } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('slate-plain-serializer', () => {
  describe('deserialize()', () => {
    const dir = resolve(__dirname, './deserialize')
    const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, options } = module
        const state = Plain.deserialize(input, options)
        const actual = State.isState(state) ? state.toJSON() : state
        const expected = State.isState(output) ? output.toJSON() : output
        assert.deepEqual(actual, expected)
      })
    }
  })

  describe('serialize()', () => {
    const dir = resolve(__dirname, './serialize')
    const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

    for (const test of tests) {
      it(test, async () => {
        const module = require(resolve(dir, test))
        const { input, output, options } = module
        const string = Plain.serialize(input, options)
        const actual = string
        const expected = output
        assert.deepEqual(actual, expected)
      })
    }
  })
})
