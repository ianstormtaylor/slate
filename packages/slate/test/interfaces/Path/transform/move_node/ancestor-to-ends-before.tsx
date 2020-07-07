import { Path } from 'slate'

const path = [3, 3, 3]
const op = {
  type: 'move_node',
  path: [3],
  newPath: [2, 5],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [2, 5, 3, 3]
