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
  return Point.isBefore(point, another)
}
export const output = false
