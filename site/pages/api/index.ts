import { readdirSync } from 'fs'
import { join } from 'path'

const examplePath = join(process.cwd(), 'examples/ts')

export function getAllExamples() {
  const slugs = readdirSync(examplePath)
  return slugs
    .filter(name => name.match(/.tsx$/))
    .map(n => n.replace(/.tsx$/, ''))
}
