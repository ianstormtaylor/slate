import assert from 'assert'
import * as fc from 'fast-check'
import { Editor, Operation, Path } from 'slate'
import { settings } from './checks'
import { command, create, document, operationFor } from './generators'

const expectedDirtyPaths = (editor: Editor, operations: Operation[]) => {
  let paths: Path[] = []
  for (const operation of operations) {
    const next: Path[] = []
    const keys = new Set<string>()
    const add = (path: Path | null) => {
      if (path && !keys.has(path.join(','))) {
        keys.add(path.join(','))
        next.push(path)
      }
    }
    for (const path of paths) {
      add(
        Path.operationCanTransformPath(operation)
          ? Path.transform(path, operation)
          : path
      )
    }
    for (const path of editor.getDirtyPaths(operation)) add(path)
    paths = next
  }
  return paths
}

describe('dirty paths', () => {
  it('keeps the same dirty paths, in the same order, across a batch', () => {
    fc.assert(
      fc.property(
        document,
        fc.array(command, { minLength: 1, maxLength: 30 }),
        (children, inputs) => {
          const editor = create(children)
          const applied: Operation[] = []
          let seen: Path[] | undefined
          let batchDone = false
          let fixedBeforeNormalizing = false
          const { apply, shouldNormalize } = editor
          editor.apply = operation => {
            if (batchDone && !seen) fixedBeforeNormalizing = true
            apply(operation)
          }
          editor.shouldNormalize = options => {
            if (options.iteration === 0 && !seen) {
              seen = options.dirtyPaths.map(path => [...path])
            }
            return shouldNormalize(options)
          }
          Editor.withoutNormalizing(editor, () => {
            for (const input of inputs) {
              const operation = operationFor(editor, input)
              if (!operation || operation.type === 'set_selection') continue
              editor.apply(operation)
              applied.push(operation)
            }
            batchDone = true
          })
          if (!applied.length || fixedBeforeNormalizing) return
          assert.deepStrictEqual(
            seen ?? [],
            expectedDirtyPaths(editor, applied)
          )
        }
      ),
      settings
    )
  })
})
