import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { History, withHistory } from '..'

const testsDir = dirname(fileURLToPath(import.meta.url))

const isFixtureFile = (file: string) =>
  (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) &&
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

const withTest = (editor: any) => {
  const { isInline, isVoid, isElementReadOnly, isSelectable } = editor

  editor.isInline = (element: any) => {
    return element.inline === true ? true : isInline(element)
  }

  editor.isVoid = (element: any) => {
    return element.void === true ? true : isVoid(element)
  }

  editor.isElementReadOnly = (element: any) => {
    return element.readOnly === true ? true : isElementReadOnly(element)
  }

  editor.isSelectable = (element: any) => {
    return element.nonSelectable === true ? false : isSelectable(element)
  }

  return editor
}

describe('slate-history', () => {
  runFixtureTree(resolve(testsDir, 'undo'), (module) => {
    const { input, output, run } = module
    const editor = withTest(withHistory(input))

    run(editor)
    editor.undo()

    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })

  runFixtureTree(resolve(testsDir, 'isHistory'), (module) => {
    const { input, output, run } = module
    const editor = withTest(withHistory(input))

    run(editor)

    assert.strictEqual(History.isHistory(editor.history), output)
  })
})
