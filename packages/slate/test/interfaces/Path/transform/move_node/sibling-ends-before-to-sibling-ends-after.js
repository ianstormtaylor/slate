import { OperationType, Path } from 'slate'

const path = [0, 1]

const op = {
  type: OperationType.MoveNode,
  path: [0, 0],
  newPath: [0, 3],
}

export const test = () => {
  return Path.transform(path, op)
}

export const output = [0, 0]
