
import 'jsdom-global/register'
import React from 'react'
import fs from 'fs'
import readMetadata from 'read-metadata'
import strip from '../helpers/strip-dynamic'
import { Raw, Editor, Schema } from '../..'
import { mount } from 'enzyme'
import { resolve } from 'path'
import { strictEqual } from '../helpers/assert-json'

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
      const props = {
        onChange: value => value,
        schema,
        state,
      }

      const wrapper = mount(<Editor {...props} />)
      const normalized = wrapper.state().state
      const output = Raw.serialize(normalized, { terse: true })
      strictEqual(strip(output), strip(expected))
    })
  }
})
