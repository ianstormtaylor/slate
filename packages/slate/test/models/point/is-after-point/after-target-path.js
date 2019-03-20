import Point from '../../../../src/models/point'

export const input = {
  point: Point.create({
    key: 'a',
    path: [4],
    offset: 1,
  }),
  target: Point.create({
    key: 'b',
    path: [2],
    offset: 2,
  }),
}

export default function({ point, target }) {
  return point.isAfterPoint(target)
}

export const output = true
