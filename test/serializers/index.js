
import assert from 'assert'
import fs from 'fs'
import parse5 from 'parse5'
import { Html, Plain, State } from '../..'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('serializers', () => {
  describe('html', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './html/deserialize')
      const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(dir, test))
          const { input, output, config, options } = module
          const html = new Html({ parseHtml: parse5.parseFragment, ...config })
          const state = html.deserialize(input, options)
          const actual = State.isState(state) ? state.toJSON() : state
          const expected = State.isState(output) ? output.toJSON() : output
          assert.deepEqual(actual, expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './html/serialize')
      const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(dir, test))
          const { input, output, rules, options } = module
          const html = new Html({ rules, parseHtml: parse5.parseFragment })
          const string = html.serialize(input, options)
          const actual = string
          const expected = output
          assert.deepEqual(actual, expected)
        })
      }
    })
  })

  describe('plain', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './plain/deserialize')
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
      const dir = resolve(__dirname, './plain/serialize')
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

  describe('raw', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './raw/deserialize')
      const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(dir, test))
          const { input, output, options } = module
          const actual = State.fromJSON(input, options).toJSON()
          const expected = output.toJSON()
          assert.deepEqual(actual, expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './raw/serialize')
      const tests = fs.readdirSync(dir).filter(t => t[0] != '.').map(t => basename(t, extname(t)))

      for (const test of tests) {
        it(test, async () => {
          const module = require(resolve(dir, test))
          const { input, output, options } = module
          const actual = input.toJSON(options)
          const expected = output
          assert.deepEqual(actual, expected)
        })
      }
    })
  })
})
