import { Path } from 'slate'

const path = [3, 3, 3]
const op = {
  type: 'move_node',
  path: [3, 0, 0],
  newPath: [3, 4],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [3, 3, 3]
