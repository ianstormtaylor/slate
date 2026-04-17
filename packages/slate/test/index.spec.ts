import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { cloneDeep } from 'lodash'
import { createEditor, Editor } from 'slate'
import { withTest } from './support/with-test.js'

const testsDir = dirname(fileURLToPath(import.meta.url))

const isFixtureFile = (file: string) =>
  (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) &&
  !file.endsWith('custom-types.ts') &&
  !file.endsWith('type-guards.ts') &&
  !file.startsWith('.') &&
  file !== 'index.js' &&
  file !== 'index.spec.ts'

const getFixtureName = (file: string) => file.replace(/\.(tsx|ts|js)$/u, '')

const runFixtureTree = (
  path: string,
  runFixture: (module: Record<string, any>) => void
) => {
  describe(basename(path), () => {
    for (const file of readdirSync(path).sort()) {
      const fixturePath = resolve(path, file)
      const stat = statSync(fixturePath)

      if (stat.isDirectory()) {
        runFixtureTree(fixturePath, runFixture)
        continue
      }

      if (!stat.isFile() || !isFixtureFile(file)) continue

      const name = getFixtureName(file)
      const source = readFileSync(fixturePath, 'utf8')
      const testFn = /\bexport const skip\s*=\s*true\b/.test(source)
        ? it.skip
        : it

      testFn(name, async () => {
        const module = (await import(
          pathToFileURL(fixturePath).href
        )) as Record<string, any>

        runFixture(module)
      })
    }
  })
}

const withBatchTest = (editor: Editor, dirties: string[]) => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    dirties.push(JSON.stringify(path))
    normalizeNode([node, path])
  }

  return editor
}

describe('slate', () => {
  runFixtureTree(resolve(testsDir, 'interfaces'), (module) => {
    let { input, test, output } = module

    if (Editor.isEditor(input)) {
      input = withTest(input)
    }

    assert.deepEqual(test(input), output)
  })

  runFixtureTree(resolve(testsDir, 'operations'), (module) => {
    const { input, operations, output } = module
    const editor = withTest(input)

    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })

    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })

  runFixtureTree(resolve(testsDir, 'normalization'), (module) => {
    const { input, output, withFallbackElement } = module
    const editor = withTest(input)

    if (withFallbackElement) {
      const { normalizeNode } = editor

      editor.normalizeNode = (entry, options) => {
        normalizeNode(entry, { ...options, fallbackElement: () => ({}) })
      }
    }

    Editor.normalize(editor, { force: true })

    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })

  runFixtureTree(resolve(testsDir, 'transforms'), (module) => {
    const { input, output, run } = module
    const editor = withTest(input)

    run(editor)

    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })

  runFixtureTree(resolve(testsDir, 'utils/deep-equal'), (module) => {
    let { input, test, output } = module

    if (Editor.isEditor(input)) {
      input = withTest(input)
    }

    assert.deepEqual(test(input), output)
  })

  describe('batchDirty', () => {
    const runBatchDirtyTree = (path: string) => {
      runFixtureTree(path, (module) => {
        const { input, run } = module
        const input2 = createEditor()
        input2.children = cloneDeep(input.children)
        input2.selection = cloneDeep(input.selection)

        const dirties1: string[] = []
        const dirties2: string[] = []

        const editor1 = withBatchTest(withTest(input), dirties1)
        const editor2 = withBatchTest(withTest(input2), dirties2)

        run(editor1, { batchDirty: true })
        run(editor2, { batchDirty: false })

        assert.equal(dirties1.join(' '), dirties2.join(' '))
      })
    }

    runBatchDirtyTree(resolve(testsDir, 'transforms/insertNodes'))
    runBatchDirtyTree(resolve(testsDir, 'transforms/insertFragment'))
  })
})
