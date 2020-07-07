import { Path } from 'slate'

export const input = []
export const test = path => {
  return Path.isPath(path)
}
export const output = true
