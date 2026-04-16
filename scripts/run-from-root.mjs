import { spawnSync } from 'node:child_process'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const [command, ...args] = process.argv.slice(2)

if (!command) {
  console.error('run-from-root.mjs needs a command')
  process.exit(1)
}

const result = spawnSync(command, args, {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
