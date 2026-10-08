import { createEditor, Transforms } from 'slate'

// `yarn lint:typescript` type-checks this file: `merge` may return scalars.
// https://github.com/ianstormtaylor/slate/issues/5490
describe('PropsMerge', () => {
  it('allows merge to return scalar values', () => {
    Transforms.setNodes(
      createEditor(),
      {},
      { merge: (prop: unknown, node: unknown) => node }
    )
  })
})
