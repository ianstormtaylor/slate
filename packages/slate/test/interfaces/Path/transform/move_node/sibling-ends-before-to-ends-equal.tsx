import { Path } from 'slate'

const path = [0, 1]
const op = {
  type: 'move_node',
  path: [0, 0],
  newPath: [0, 1],
}
export const test = () => {
  return Path.transform(path, op)
}
export const output = [0, 0]
