import { OperationType, Path } from 'slate'

const path = [3, 3, 3]

const op = {
  type: OperationType.MoveNode,
  path: [2],
  newPath: [3],
}

export const test = () => {
  return Path.transform(path, op)
}

export const output = [2, 3, 3]
