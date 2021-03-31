import { Path } from 'slate'

export const input = [0, 1, 2]
export const test = path => {
  return Path.ancestors(path)
}
export const output = [[], [0], [0, 1]]
