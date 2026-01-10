import { Path } from 'slate'

export const input = [2, 4, 'b']
export const test = (value: typeof input) => {
  return Path.isPath(value)
}
export const output = false
