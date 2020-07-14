import { Path } from 'slate'

export const input = {
  path: [1, 2],
  another: [0],
}
export const test = ({ path, another }) => {
  return Path.isSibling(path, another)
}
export const output = false
