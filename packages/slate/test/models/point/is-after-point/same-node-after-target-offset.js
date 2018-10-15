import Point from '../../../../src/models/point'

export const input = {
  point: Point.create({
    key: 'a',
    path: [0, 1],
    offset: 4,
  }),
  target: Point.create({
    key: 'a',
    path: [0, 1],
    offset: 3,
  }),
}

export default function({ point, target }) {
  return point.isAfterPoint(target)
}

export const output = true
