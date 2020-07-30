import { Path } from 'slate'

export const input = {
  path: [0, 1],
  another: [0, 1],
}
export const test = ({ path, another }) => {
  return Path.isSibling(path, another)
}
export const output = false
