
import assert from 'assert'
import fs from 'fs'
import readYaml from 'read-yaml-promise'
import strip from '../helpers/strip-dynamic'
import { Html, Plain, Raw } from '../..'
import { resolve } from 'path'
import React from 'react'
import { Iterable } from 'immutable'
import parse5 from 'parse5'

/**
 * Tests.
 */

describe('serializers', () => {
  describe('html', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './fixtures/html/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const htmlOpts = Object.assign({}, require(innerDir).default, { parseHtml: parse5.parseFragment })
          const html = new Html(htmlOpts)
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const input = fs.readFileSync(resolve(innerDir, 'input.html'), 'utf8')
          const state = html.deserialize(input)
          const json = state.document.toJS()
          assert.deepEqual(strip(json), expected)
        })
      }

      it('optionally returns a raw representation', () => {
        const fixture = require('./fixtures/html/deserialize/block').default
        const htmlOpts = Object.assign({}, fixture, { parseHtml: parse5.parseFragment })
        const html = new Html(htmlOpts)
        const input = fs.readFileSync(resolve(__dirname, './fixtures/html/deserialize/block/input.html'), 'utf8')
        const serialized = html.deserialize(input, { toRaw: true })
        assert.deepEqual(serialized, {
          kind: 'state',
          document: {
            kind: 'document',
            nodes: [
              {
                kind: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    kind: 'text',
                    text: 'one'
                  }
                ]
              }
            ]
          }
        })
      })

      it('optionally does not normalize', () => {
        const fixture = require('./fixtures/html/deserialize/inline-with-is-void').default
        const htmlOpts = Object.assign({}, fixture, { parseHtml: parse5.parseFragment })
        const html = new Html(htmlOpts)
        const input = fs.readFileSync(resolve(__dirname, './fixtures/html/deserialize/inline-with-is-void/input.html'), 'utf8')
        const serialized = html.deserialize(input, { toRaw: true, normalize: false })
        assert.deepEqual(serialized, {
          kind: 'state',
          document: {
            kind: 'document',
            nodes: [
              {
                kind: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    kind: 'inline',
                    type: 'link',
                    isVoid: true,
                  }
                ]
              }
            ]
          }
        })
      })
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './fixtures/html/serialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const htmlOpts = Object.assign({}, require(innerDir).default, { parseHtml: parse5.parseFragment })
          const html = new Html(htmlOpts)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = fs.readFileSync(resolve(innerDir, 'output.html'), 'utf8')
          const serialized = html.serialize(input)
          assert.deepEqual(serialized, expected.trim())
        })
      }

      it('optionally returns an iterable list of React elements', () => {
        const fixture = require('./fixtures/html/serialize/block-nested').default
        const htmlOpts = Object.assign({}, fixture, { parseHtml: parse5.parseFragment })
        const html = new Html(htmlOpts)
        const input = require('./fixtures/html/serialize/block-nested/input.js').default
        const serialized = html.serialize(input, { render: false })
        assert(Iterable.isIterable(serialized), 'did not return an interable list')
        assert(React.isValidElement(serialized.first()), 'did not return valid React elements')
      })
    })
  })

  describe('plain', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './fixtures/plain/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const input = fs.readFileSync(resolve(innerDir, 'input.txt'), 'utf8')
          const state = Plain.deserialize(input.replace(/\n$/m, ''))
          const json = state.document.toJS()
          assert.deepEqual(strip(json), expected)
        })
      }

      it('optionally returns a raw representation', () => {
        const input = fs.readFileSync(resolve(__dirname, './fixtures/plain/deserialize/line/input.txt'), 'utf8')
        const serialized = Plain.deserialize(input.replace(/\n$/m, ''), { toRaw: true })
        assert.deepEqual(serialized, {
          kind: 'state',
          document: {
            kind: 'document',
            nodes: [
              {
                kind: 'block',
                type: 'line',
                nodes: [
                  {
                    kind: 'text',
                    ranges: [
                      {
                        marks: [],
                        text: 'one',
                      }
                    ]
                  }
                ]
              }
            ]
          }
        })
      })
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './fixtures/plain/serialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = fs.readFileSync(resolve(innerDir, 'output.txt'), 'utf8')
          const serialized = Plain.serialize(input)
          assert.deepEqual(serialized, expected.replace(/\n$/m, ''))
        })
      }
    })
  })

  describe('raw', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './fixtures/raw/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const input = await readYaml(resolve(innerDir, 'input.yaml'))
          const state = Raw.deserialize(input)
          const json = state.document.toJS()
          assert.deepEqual(strip(json), expected)
        })
      }
    })

    describe('serialize()', () => {
      const dir = resolve(__dirname, './fixtures/raw/serialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const serialized = Raw.serialize(input)
          serialized.document = strip(serialized.document)
          assert.deepEqual(serialized, expected)
        })
      }
    })

    describe('deserialize({ terse: true })', () => {
      const dir = resolve(__dirname, './fixtures/raw/deserialize-terse')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const input = await readYaml(resolve(innerDir, 'input.yaml'))
          const state = Raw.deserialize(input, { terse: true })
          const json = state.document.toJS()
          assert.deepEqual(strip(json), expected)
        })
      }
    })

    describe('serialize({ terse: true })', () => {
      const dir = resolve(__dirname, './fixtures/raw/serialize-terse')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue
        it(test, async () => {
          const innerDir = resolve(dir, test)
          const input = require(resolve(innerDir, 'input.js')).default
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const serialized = Raw.serialize(input, { terse: true })
          assert.deepEqual(strip(serialized), expected)
        })
      }
    })

    describe('serialize({ preserveKeys: true })', () => {
      it('should omit keys by default', () => {
        const state = Plain.deserialize('string')
        const serialized = Raw.serialize(state)
        assert(typeof serialized.document.key === 'undefined')
      })

      it('should preserve keys', () => {
        const state = Plain.deserialize('string')
        const serialized = Raw.serialize(state, { preserveKeys: true })
        assert(typeof serialized.document.key === 'string')
      })
    })
  })
})
