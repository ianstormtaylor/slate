import AfterPlugin from '../../src/plugins/after'
import BeforePlugin from '../../src/plugins/before'
import Simulator from 'slate-simulator'
import assert from 'assert'
import { fixtures } from 'slate-dev-test-utils'

describe.skip('plugins', () => {
  fixtures(__dirname, 'core', ({ module }) => {
    const { input, output, props = {} } = module
    const fn = module.default
    const plugins = [BeforePlugin(props), AfterPlugin(props)]
    const simulator = new Simulator({ plugins, value: input })
    fn(simulator)

    const actual = simulator.value.toJSON({ preserveSelection: true })
    const expected = output.toJSON({ preserveSelection: true })
    assert.deepEqual(actual, expected)
  })
})
