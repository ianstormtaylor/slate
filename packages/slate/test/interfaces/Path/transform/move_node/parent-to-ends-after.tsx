import { Path } from 'slate'

const path = [3, 3, 3]
const op = {
  type: 'move_node',
  path: [3, 3],
  newPath: [5, 1],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [5, 1, 3]
