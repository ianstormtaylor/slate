import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

type FixtureModule = {
  input: Record<string, unknown> | unknown[]
  output: Record<string, unknown> | unknown[]
  skip?: boolean
}

const fixturesDir = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures')

const isFixtureFile = (file: string) =>
  (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) &&
  !file.endsWith('custom-types.ts') &&
  !file.endsWith('type-guards.ts') &&
  !file.startsWith('.') &&
  file !== 'index.js'

const fixtureNameRe = /\.hsx\.tsx$|\.tsx$|\.ts$|\.js$/u

const getFixtureName = (file: string) => file.replace(fixtureNameRe, '')

const runFixtures = (path: string) => {
  describe(basename(path), () => {
    for (const file of readdirSync(path).sort()) {
      const fixturePath = resolve(path, file)
      const stat = statSync(fixturePath)

      if (stat.isDirectory()) {
        runFixtures(fixturePath)
        continue
      }

      if (!stat.isFile() || !isFixtureFile(file)) continue

      const name = getFixtureName(file)
      const source = readFileSync(fixturePath, 'utf8')
      const testFn = /\bexport const skip\s*=\s*true\b/.test(source)
        ? it.skip
        : it

      testFn(name, async () => {
        const { input, output } = (await import(
          pathToFileURL(fixturePath).href
        )) as FixtureModule

        const actual = Array.isArray(output)
          ? input
          : Object.fromEntries(
              Object.keys(output).map((key) => [
                key,
                (input as Record<string, unknown>)[key],
              ])
            )

        expect(actual).toEqual(output)
      })
    }
  })
}

describe('slate-hyperscript', () => {
  runFixtures(fixturesDir)
})
