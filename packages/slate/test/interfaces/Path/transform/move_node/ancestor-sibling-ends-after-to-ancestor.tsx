import { Path } from 'slate'

const path = [3, 3, 3]
const op = {
  type: 'move_node',
  path: [4],
  newPath: [3],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [4, 3, 3]
