import assert from 'assert'
import { fixtures } from 'slate-dev-test-utils'

fixtures(__dirname, ({ module }) => {
  const { input, output } = module
  const fn = module.default
  const change = input.change()
  fn(change)
  const opts = { preserveSelection: true, preserveData: true }
  const actual = change.value.toJSON(opts)
  const expected = output.toJSON(opts)
  assert.deepEqual(actual, expected)
})
