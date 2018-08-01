import assert from 'assert'
import { fixtures } from 'slate-dev-test-utils'

fixtures(__dirname, ({ module }) => {
  const { input, output } = module
  const operations = module.default
  const change = input.change()
  change.applyOperations(operations)
  const opts = {
    preserveSelection: true,
    preserveDecorations: true,
    preserveData: true,
  }
  const actual = change.value.toJSON(opts)
  const expected = output.toJSON(opts)
  assert.deepEqual(actual, expected)
})
