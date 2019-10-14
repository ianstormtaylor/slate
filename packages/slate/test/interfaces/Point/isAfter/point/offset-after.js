import { Point } from 'slate'

const point = {
  path: [4],
  offset: 3,
}

const another = {
  path: [4],
  offset: 0,
}

export const test = () => {
  return Point.isAfter(point, another)
}

export const output = true
