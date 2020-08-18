import { Point } from 'slate'

export const input = {
  point: {
    path: [0, 1],
    offset: 0,
  },
  another: {
    path: [0, 1],
    offset: 3,
  },
}
export const test = ({ point, another }) => {
  return Point.equals(point, another)
}
export const output = false
