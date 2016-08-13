
import React from 'react'
import fs from 'fs'
import strip from '../helpers/strip-dynamic'
import readMetadata from 'read-metadata'
import { Raw, Editor, Schema } from '../..'
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

      const state = Raw.deserialize(input, { terse: true })
      const editor = <Editor state={state} schema={schema} />
      const output = Raw.serialize(state, { terse: true })
      strictEqual(strip(output), strip(expected))
    })
  }
})
