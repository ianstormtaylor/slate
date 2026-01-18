import fs from 'fs'
import { basename, extname, resolve } from 'path'

type fixtureFunction<T> = (options: {
  name: string
  path: string
  module: T
}) => void

interface fixtureOptions {
  skip?: boolean
}

type fixtureArguments<T> =
  | [...paths: string[], fn: fixtureFunction<T>]
  | [...paths: string[], fn: fixtureFunction<T>, options: fixtureOptions]

export const fixtures = <T>(...args: fixtureArguments<T>) => {
  let fn = args.pop() as fixtureFunction<T>
  let options: fixtureOptions = { skip: false }

  if (typeof fn !== 'function') {
    options = fn as fixtureOptions
    fn = args.pop() as fixtureFunction<T>
  }

  const path = resolve(...(args as string[]))
  const files = fs.readdirSync(path)
  const dir = basename(path)
  const d = options.skip ? describe.skip : describe

  d(dir, () => {
    for (const file of files) {
      const p = resolve(path, file)
      const stat = fs.statSync(p)

      if (stat.isDirectory()) {
        fixtures(path, file, fn)
      }
      if (
        stat.isFile() &&
        (file.endsWith('.js') ||
          file.endsWith('.tsx') ||
          file.endsWith('.ts')) &&
        !file.endsWith('custom-types.ts') &&
        !file.endsWith('type-guards.ts') &&
        !file.startsWith('.') &&
        // Ignoring `index.js` files allows us to use the fixtures directly
        // from the top-level directory itself, instead of only children.
        file !== 'index.js'
      ) {
        const name = basename(file, extname(file))

        // This needs to be a non-arrow function to use `this.skip()`.
        it(`${name} `, function () {
          const module = require(p)

          if (module.skip) {
            this.skip()
          }

          fn({ name, path, module })
        })
      }
    }
  })
}

fixtures.skip = <T>(...args: [...string[], fixtureFunction<T>]) => {
  fixtures(...args, { skip: true })
}
