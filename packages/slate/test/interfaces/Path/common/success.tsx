import { Path } from 'slate'

export const input = {
  path: [0, 1, 2],
  another: [0, 2],
}
export const test = ({ path, another }) => {
  return Path.common(path, another)
}
export const output = [0]
