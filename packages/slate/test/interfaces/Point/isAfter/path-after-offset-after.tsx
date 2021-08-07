import { Point } from 'slate'

export const input = {
  point: {
    path: [0, 4],
    offset: 7,
  },
  another: {
    path: [0, 1],
    offset: 3,
  },
}
export const test = ({ point, another }) => {
  return Point.isAfter(point, another)
}
export const output = true
