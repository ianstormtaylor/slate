import Point from '../../../../src/models/point'

export const input = {
  point: Point.create({
    key: 'a',
    path: [1, 2],
    offset: 1,
  }),
  target: Point.create({
    key: 'b',
    path: [1],
    offset: 1,
  }),
}

export default function({ point, target }) {
  return point.isBeforePoint(target)
}

export const output = false
