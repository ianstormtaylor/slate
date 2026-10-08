import { Path } from 'slate'

const path = [3, 3, 3]
const op = {
  type: 'move_node' as const,
  path: [4],
  newPath: [2],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [4, 3, 3]
