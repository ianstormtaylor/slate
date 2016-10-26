
import fs from 'fs'
import readMetadata from 'read-metadata'
import strip from '../helpers/strip-dynamic'
import toCamel from 'to-camel-case'
import { Raw } from '../..'
import { strictEqual } from '../helpers/assert-json'
import { resolve } from 'path'

/**
 * Tests.
 */

describe('transforms', () => {
  describe('by-key', () => {
    const dir = resolve(__dirname, './fixtures/by-key')
    const transforms = fs.readdirSync(dir)

    for (const transform of transforms) {
      if (transform[0] == '.') continue
      if (transform == 'insert-node-by-key') continue

      describe(`${toCamel(transform)}()`, () => {
        const transformDir = resolve(__dirname, './fixtures/by-key', transform)
        const tests = fs.readdirSync(transformDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, () => {
            const testDir = resolve(transformDir, test)
            const fn = require(testDir).default
            const input = readMetadata.sync(resolve(testDir, 'input.yaml'))
            const expected = readMetadata.sync(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            strictEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('on-selection', () => {
    const dir = resolve(__dirname, './fixtures/on-selection')
    const transforms = fs.readdirSync(dir)

    for (const transform of transforms) {
      if (transform[0] == '.') continue

      describe(`${toCamel(transform)}()`, () => {
        const transformDir = resolve(__dirname, './fixtures/on-selection', transform)
        const tests = fs.readdirSync(transformDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, () => {
            const testDir = resolve(transformDir, test)
            const fn = require(testDir).default
            const input = readMetadata.sync(resolve(testDir, 'input.yaml'))
            const state = Raw.deserialize(input, { terse: true })
            fn(state)
          })
        }
      })
    }
  })

  describe('at-range', () => {
    const dir = resolve(__dirname, './fixtures/at-range')
    const transforms = fs.readdirSync(dir)

    for (const transform of transforms) {
      if (transform[0] == '.') continue

      describe(`${toCamel(transform)}()`, () => {
        const transformDir = resolve(__dirname, './fixtures/at-range', transform)
        const tests = fs.readdirSync(transformDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, () => {
            const testDir = resolve(transformDir, test)
            const fn = require(testDir).default
            const input = readMetadata.sync(resolve(testDir, 'input.yaml'))
            const expected = readMetadata.sync(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            strictEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('at-current-range', () => {
    const dir = resolve(__dirname, './fixtures/at-current-range')
    const transforms = fs.readdirSync(dir)

    for (const transform of transforms) {
      if (transform[0] == '.') continue

      describe(`${toCamel(transform)}()`, () => {
        const transformDir = resolve(__dirname, './fixtures/at-current-range', transform)
        const tests = fs.readdirSync(transformDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, () => {
            const testDir = resolve(transformDir, test)
            const fn = require(testDir).default
            const input = readMetadata.sync(resolve(testDir, 'input.yaml'))
            const expected = readMetadata.sync(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            strictEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('on-history', () => {
    const dir = resolve(__dirname, './fixtures/on-history')
    const transforms = fs.readdirSync(dir)

    for (const transform of transforms) {
      if (transform[0] == '.') continue

      describe(`${toCamel(transform)}()`, () => {
        const transformDir = resolve(__dirname, './fixtures/on-history', transform)
        const tests = fs.readdirSync(transformDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, () => {
            const testDir = resolve(transformDir, test)
            const fn = require(testDir).default
            const input = readMetadata.sync(resolve(testDir, 'input.yaml'))
            const expected = readMetadata.sync(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            strictEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })
})
