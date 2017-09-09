
import React from 'react'
import assert from 'assert'
import fs from 'fs'
import isPlainObject from 'is-plain-object'
import parse5 from 'parse5'
import readYaml from 'read-yaml-promise'
import { Html, Plain, Raw, State } from '../..'
import { Iterable } from 'immutable'
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('serializers', () => {
  describe('html', () => {
    describe('deserialize()', () => {
      const dir = resolve(__dirname, './html/deserialize')
      const tests = fs.readdirSync(dir)

      for (const test of tests) {
        if (test[0] === '.') continue

        it(test, async () => {
          const innerDir = resolve(dir, test)
          const htmlOpts = Object.assign({}, require(innerDir).default, { parseHtml: parse5.parseFragment })
          const html = new Html(htmlOpts)
          const input = fs.readFileSync(resolve(innerDir, 'input.html'), 'utf8')
          const expected = await readYaml(resolve(innerDir, 'output.yaml'))
          const state = html.deserialize(input)
          const json = state.toJSON()
          assert.deepEqual(json, expected)
        })
      }

      it('optionally returns a raw representation', () => {
        const fixture = require('./html/deserialize/block').default
        const htmlOpts = Object.assign({}, fixture, { parseHtml: parse5.parseFragment })
        const html = new Html(htmlOpts)
        const input = fs.readFileSync(resolve(__dirname, './html/deserialize/block/input.html'), 'utf8')
        const serialized = html.deserialize(input, { toRaw: true })
        assert(isPlainObject(serialized))
      })

      it('optionally does not normalize', () => {
        const fixture = require('./html/deserialize/inline-with-is-void').default
        const htmlOpts = Object.assign({}, fixture, { parseHtml: parse5.parseFragment })
        const html = new Html(htmlOpts)
        const input = fs.readFileSync(resolve(__dirname, './html/deserialize/inline-with-is-void/input.html'), 'utf8')
        const serialized = html.deserialize(input, { toRaw: true, normalize: false })
        assert.deepEqual(serialized, {
          kind: 'state',
          document: {
            kind: 'document',
            data: {},
            nodes: [
              {
                kind: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    kind: 'inline',
                    type: 'emoji',
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
      const dir = resolve(__dirname, './html/serialize')
      const tests = fs.readdirSync(dir).filter(t => t[0] != '.' && !!~t.indexOf('.js')).map(t => basename(t, extname(t)))

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

      it.skip('optionally returns an iterable list of React elements', async () => {
        const fixture = require('./html/serialize/block-nested').default
        const htmlOpts = Object.assign({}, fixture, { parseHtml: parse5.parseFragment })
        const html = new Html(htmlOpts)
        const input = await readYaml(resolve(__dirname, './html/serialize/block-nested/input.yaml'))
        const state = Raw.deserialize(input)
        const serialized = html.serialize(state, { render: false })
        assert(Iterable.isIterable(serialized), 'did not return an interable list')
        assert(React.isValidElement(serialized.first()), 'did not return valid React elements')
      })
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
          const actual = Raw.deserialize(input, options).toJSON()
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
          const actual = Raw.serialize(input, options)
          const expected = output
          assert.deepEqual(actual, expected)
        })
      }
    })
  })
})
