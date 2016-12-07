
import assert from 'assert'
import fs from 'fs'
import readYaml from 'read-yaml-promise'
import strip from '../helpers/strip-dynamic'
import { Raw, Schema } from '../..'
import { resolve } from 'path'

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

        it(test, async () => {
          const testDir = resolve(__dirname, './fixtures', category, test)
          const input = await readYaml(resolve(testDir, 'input.yaml'))
          const expected = await readYaml(resolve(testDir, 'output.yaml'))
          const schema = Schema.create(require(testDir))
          const state = Raw.deserialize(input, { terse: true })
          const normalized = state.transform().normalize(schema).apply()
          const output = Raw.serialize(normalized, { terse: true })
          assert.deepEqual(strip(output), strip(expected))
        })
      }
    })
  }
})
