import { Point } from 'slate'

export const input = {
  point: {
    path: [0, 1],
    offset: 7,
  },
  another: {
    path: [0, 1],
    offset: 7,
  },
}
export const test = ({ point, another }) => {
  return Point.compare(point, another)
}
export const output = 0
