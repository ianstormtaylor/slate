import assert from 'assert'
import { fixtures } from 'slate-dev-test-utils'

fixtures(__dirname, ({ module }) => {
  const { input, output } = module
  const fn = module.default
  const next = fn(input)
  const opts = { preserveSelection: true, preserveData: true }
  const actual = next.toJSON(opts)
  const expected = output.toJSON(opts)
  assert.deepEqual(actual, expected)
})
