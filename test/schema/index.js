
import fs from 'fs'
import strip from '../helpers/strip-dynamic'
import readMetadata from 'read-metadata'
import { Raw, Schema } from '../..'
import { strictEqual } from '../helpers/assert-json'
import { resolve } from 'path'

/**
 * Tests.
 */

describe('schema', () => {
  const tests = fs.readdirSync(resolve(__dirname, './fixtures'))

  for (const test of tests) {
    if (test[0] == '.') continue

    it(test, () => {
      const dir = resolve(__dirname, './fixtures', test)
      const input = readMetadata.sync(resolve(dir, 'input.yaml'))
      const expected = readMetadata.sync(resolve(dir, 'output.yaml'))
      const schema = Schema.create(require(dir))

      let state = Raw.deserialize(input, { terse: true })
      state = schema.transform(state)
      const output = Raw.serialize(state, { terse: true })
      strictEqual(strip(output), strip(expected))
    })
  }
})
