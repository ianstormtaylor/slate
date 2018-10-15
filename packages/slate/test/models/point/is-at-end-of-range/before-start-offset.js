import Point from '../../../../src/models/point'
import Range from '../../../../src/models/range'

export const input = {
  point: Point.create({
    key: 'b',
    path: [1],
    offset: 2,
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
  return point.isAtEndOfRange(target)
}

export const output = false
