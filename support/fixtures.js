import fs from 'fs'
import { basename, extname, resolve } from 'path'

export const fixtures = (...args) => {
  let fn = args.pop()
  let options = { skip: false }

  if (typeof fn !== 'function') {
    options = fn
    fn = args.pop()
  }

  const path = resolve(...args)
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
        (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) &&
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
            return
          }

          fn({ name, path, module })
        })
      }
    }
  })
}

fixtures.skip = (...args) => {
  fixtures(...args, { skip: true })
}
