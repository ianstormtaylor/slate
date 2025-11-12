import fs from 'fs'
import { basename, extname, resolve } from 'path'

export const fixtures = (...args) => {
  let fn = args.pop()
  let options = { skip: false }

  if (typeof fn !== 'function') {
    options = fn
    fn = args.pop()
  }

  const dirPath = resolve(...args)
  const dirName = basename(dirPath)
  const describeFn = options.skip ? describe.skip : describe

  try {
    const files = fs.readdirSync(dirPath)

    describeFn(dirName, () => {
      files.forEach((file) => {
        const filePath = resolve(dirPath, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          fixtures(dirPath, file, fn)
          return
        }

        if (!isValidFixtureFile(file)) return

        const testName = basename(file, extname(file))

        it(testName, function () {
          const module = require(filePath)
          if (module.skip) {
            this.skip()
            return
          }
          fn({ name: testName, path: filePath, module })
        })
      })
    })
  } catch (error) {
    console.error(`Error reading fixtures from ${dirPath}:`, error)
  }
}

// Helper function to filter valid test files
const isValidFixtureFile = (file) => {
  if (file.startsWith('.') || file === 'index.js') return false

  const validExtensions = ['.js', '.ts', '.tsx']
  const excludedFiles = ['custom-types.ts', 'type-guards.ts']

  return validExtensions.includes(extname(file)) && !excludedFiles.includes(file)
}

fixtures.skip = (...args) => {
  fixtures(...args, { skip: true })
}
