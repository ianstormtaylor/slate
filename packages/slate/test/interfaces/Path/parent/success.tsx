import { Path } from 'slate'

export const input = [0, 1]
export const test = path => {
  return Path.parent(path)
}
export const output = [0]
