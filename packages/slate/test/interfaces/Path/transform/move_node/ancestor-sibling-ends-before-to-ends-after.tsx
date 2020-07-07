import { Path } from 'slate'

const path = [3, 3, 3]
const op = {
  type: 'move_node',
  path: [2],
  newPath: [4],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [2, 3, 3]
