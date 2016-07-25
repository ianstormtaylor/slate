
import assert from 'assert'
import fs from 'fs'
import readMetadata from 'read-metadata'
import strip from '../helpers/strip-dynamic'
import { Html, Plain, Raw } from '../..'
import { equal, strictEqual } from '../helpers/assert-json'
import { resolve } from 'path'

/**
 * Tests.
 */

describe('serializers', () => {
  describe('html', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './fixtures/html/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const html = new Html(require(innerDir).default)
          const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
          const input = fs.readFileSync(resolve(innerDir, 'input.html'), 'utf8')
          const state = html.deserialize(input)
          const json = state.document.toJS()
          strictEqual(strip(json), expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './fixtures/html/serialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const html = new Html(require(innerDir).default)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = fs.readFileSync(resolve(innerDir, 'output.html'), 'utf8')
          const serialized = html.serialize(input)
          strictEqual(serialized, expected.trim())
        })
      }
    })
  })

  describe('plain', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './fixtures/plain/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
          const input = fs.readFileSync(resolve(innerDir, 'input.txt'), 'utf8')
          const state = Plain.deserialize(input.trim())
          const json = state.document.toJS()
          strictEqual(strip(json), expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './fixtures/plain/serialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = fs.readFileSync(resolve(innerDir, 'output.txt'), 'utf8')
          const serialized = Plain.serialize(input)
          strictEqual(serialized, expected.trim())
        })
      }
    })
  })

  describe('raw', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './fixtures/raw/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
          const input = readMetadata.sync(resolve(innerDir, 'input.yaml'))
          const state = Raw.deserialize(input)
          const json = state.document.toJS()
          strictEqual(strip(json), expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './fixtures/raw/serialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        it(test, () => {
          const innerDir = resolve(dir, test)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
          const serialized = Raw.serialize(input)
          strictEqual(strip(serialized), expected)
        })
      }
    })
  })
})
