
import 'jsdom-global/register'
import React from 'react'
import fs from 'fs'
import readMetadata from 'read-metadata'
import strip from '../helpers/strip-dynamic'
import { Raw, Schema } from '../..'
import { mount } from 'enzyme'
import { resolve } from 'path'
import { strictEqual } from '../helpers/assert-json'

/**
 * Tests.
 */

describe('schema', () => {
  const dir = resolve(__dirname, './fixtures/')
  const categories = fs.readdirSync(dir)

  for (const category of categories) {
    if (category[0] == '.') continue

    describe(category, () => {
      const tests = fs.readdirSync(resolve(__dirname, './fixtures', category))

      for (const test of tests) {
        if (test[0] == '.') continue

        it(test, () => {
          const testDir = resolve(__dirname, './fixtures', category, test)
          const input = readMetadata.sync(resolve(testDir, 'input.yaml'))
          const expected = readMetadata.sync(resolve(testDir, 'output.yaml'))
          const schema = Schema.create(require(testDir))
          const state = Raw.deserialize(input, { terse: true })
          const normalized = state.transform().normalizeWith(schema).apply()
          const output = Raw.serialize(normalized, { terse: true })
          strictEqual(strip(output), strip(expected))
        })
      }
    })
  }
})
