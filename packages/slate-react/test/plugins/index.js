import AfterPlugin from '../../src/plugins/after'
import BeforePlugin from '../../src/plugins/before'
import Simulator from 'slate-simulator'
import assert from 'assert'
import fs from 'fs'
import toCamel from 'to-camel-case' // eslint-disable-line import/no-extraneous-dependencies
import { basename, extname, resolve } from 'path'

/**
 * Tests.
 */

describe('plugins', () => {
  describe.skip('core', () => {
    const dir = resolve(__dirname, 'core')
    const events = fs
      .readdirSync(dir)
      .filter(e => e[0] != '.' && e != 'index.js')

    for (const event of events) {
      describe(`${toCamel(event)}`, () => {
        const testDir = resolve(dir, event)
        const tests = fs
          .readdirSync(testDir)
          .filter(t => t[0] != '.' && !!~t.indexOf('.js'))
          .map(t => basename(t, extname(t)))

        for (const test of tests) {
          it(test, async () => {
            const module = require(resolve(testDir, test))
            const { input, output, props = {} } = module
            const fn = module.default
            const plugins = [BeforePlugin(props), AfterPlugin(props)]
            const simulator = new Simulator({ plugins, value: input })
            fn(simulator)

            const actual = simulator.value.toJSON({ preserveSelection: true })
            const expected = output.toJSON({ preserveSelection: true })
            assert.deepEqual(actual, expected)
          })
        }
      })
    }
  })
})
