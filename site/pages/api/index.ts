import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const examplePath = process.cwd().endsWith('/site')
  ? join(process.cwd(), 'examples/ts')
  : join(process.cwd(), 'site/examples/ts')

export function getAllExamples() {
  const slugs = readdirSync(examplePath)
  return slugs
    .filter((name) => name.match(/.tsx$/))
    .map((n) => n.replace(/.tsx$/, ''))
}
