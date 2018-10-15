import Point from '../../../../src/models/point'
import Range from '../../../../src/models/range'

export const input = {
  point: Point.create({
    key: 'a',
    path: [0],
    offset: 7,
  }),
  target: Range.create({
    anchor: {
      key: 'b',
      path: [1],
      offset: 4,
    },
    focus: {
      key: 'c',
      path: [2],
      offset: 3,
    },
  }),
}

export default function({ point, target }) {
  return point.isAfterRange(target)
}

export const output = false
