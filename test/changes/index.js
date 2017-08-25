
import assert from 'assert'
import fs from 'fs-promise'
import readYaml from 'read-yaml-promise'
import strip from '../helpers/strip-dynamic'
import toCamel from 'to-camel-case'
import { Raw } from '../..'
import { resolve } from 'path'

/**
 * Tests.
 */

describe('changes', async () => {
  describe('by-key', () => {
    const dir = resolve(__dirname, './fixtures/by-key')
    const changes = fs.readdirSync(dir)

    for (const change of changes) {
      if (change[0] == '.') continue

      describe(`${toCamel(change)}()`, () => {
        const changeDir = resolve(__dirname, './fixtures/by-key', change)
        const tests = fs.readdirSync(changeDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, async () => {
            const testDir = resolve(changeDir, test)
            const fn = require(testDir).default
            const input = await readYaml(resolve(testDir, 'input.yaml'))
            const expected = await readYaml(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            assert.deepEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('on-selection', () => {
    const dir = resolve(__dirname, './fixtures/on-selection')
    const changes = fs.readdirSync(dir)

    for (const change of changes) {
      if (change[0] == '.') continue

      describe(`${toCamel(change)}()`, () => {
        const changeDir = resolve(__dirname, './fixtures/on-selection', change)
        const tests = fs.readdirSync(changeDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, async () => {
            const testDir = resolve(changeDir, test)
            const fn = require(testDir).default
            const input = await readYaml(resolve(testDir, 'input.yaml'))
            const state = Raw.deserialize(input, { terse: true })
            fn(state)
          })
        }
      })
    }
  })

  describe('at-range', () => {
    const dir = resolve(__dirname, './fixtures/at-range')
    const changes = fs.readdirSync(dir)

    for (const change of changes) {
      if (change[0] == '.') continue

      describe(`${toCamel(change)}()`, () => {
        const changeDir = resolve(__dirname, './fixtures/at-range', change)
        const tests = fs.readdirSync(changeDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, async () => {
            const testDir = resolve(changeDir, test)
            const fn = require(testDir).default
            const input = await readYaml(resolve(testDir, 'input.yaml'))
            const expected = await readYaml(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            assert.deepEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('at-current-range', () => {
    const dir = resolve(__dirname, './fixtures/at-current-range')
    const changes = fs.readdirSync(dir)

    for (const change of changes) {
      if (change[0] == '.') continue

      describe(`${toCamel(change)}()`, () => {
        const changeDir = resolve(__dirname, './fixtures/at-current-range', change)
        const tests = fs.readdirSync(changeDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, async () => {
            const testDir = resolve(changeDir, test)
            const fn = require(testDir).default
            const input = await readYaml(resolve(testDir, 'input.yaml'))
            const expected = await readYaml(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            assert.deepEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('on-history', () => {
    const dir = resolve(__dirname, './fixtures/on-history')
    const changes = fs.readdirSync(dir)

    for (const change of changes) {
      if (change[0] == '.') continue

      describe(`${toCamel(change)}()`, () => {
        const changeDir = resolve(__dirname, './fixtures/on-history', change)
        const tests = fs.readdirSync(changeDir)

        for (const test of tests) {
          if (test[0] == '.') continue

          it(test, async () => {
            const testDir = resolve(changeDir, test)
            const fn = require(testDir).default
            const input = await readYaml(resolve(testDir, 'input.yaml'))
            const expected = await readYaml(resolve(testDir, 'output.yaml'))

            let state = Raw.deserialize(input, { terse: true })
            state = fn(state)
            const output = Raw.serialize(state, { terse: true })
            assert.deepEqual(strip(output), strip(expected))
          })
        }
      })
    }
  })

  describe('call', () => {
    const dir = resolve(__dirname, './fixtures/call')
    const tests = fs.readdirSync(dir)
    for (const test of tests) {
      if (test[0] == '.') continue

      it(test, async () => {
        const testDir = resolve(dir, test)
        const fn = require(testDir).default
        const input = await readYaml(resolve(testDir, 'input.yaml'))
        const expected = await readYaml(resolve(testDir, 'output.yaml'))

        let state = Raw.deserialize(input, { terse: true })
        state = fn(state)
        const output = Raw.serialize(state, { terse: true })
        assert.deepEqual(strip(output), strip(expected))
      })
    }
  })

  describe('general', () => {
    const dir = resolve(__dirname, './fixtures/general')
    const tests = fs.readdirSync(dir)

    for (const test of tests) {
      if (test[0] == '.') continue

      it(test, async () => {
        const testDir = resolve(dir, test)
        const fn = require(testDir).default
        const input = await readYaml(resolve(testDir, 'input.yaml'))
        const expected = await readYaml(resolve(testDir, 'output.yaml'))

        let state = Raw.deserialize(input, { terse: true })
        state = fn(state)
        const output = Raw.serialize(state, { terse: true, preserveStateData: true })
        assert.deepEqual(strip(output), strip(expected))
      })
    }
  })
})
