import { Path } from 'slate'

export const input = [0, 1]
export const test = path => {
  return Path.next(path)
}
export const output = [0, 2]
