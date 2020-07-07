import { Path } from 'slate'

export const input = [0, 1]
export const test = path => {
  return Path.isPath(path)
}
export const output = true
