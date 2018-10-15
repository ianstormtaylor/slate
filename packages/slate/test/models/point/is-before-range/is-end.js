import Point from '../../../../src/models/point'
import Range from '../../../../src/models/range'

export const input = {
  point: Point.create({
    key: 'c',
    path: [2],
    offset: 3,
  }),
  target: Range.create({
    anchor: {
      key: 'b',
      path: [1],
      offset: 0,
    },
    focus: {
      key: 'c',
      path: [2],
      offset: 3,
    },
  }),
}

export default function({ point, target }) {
  return point.isBeforeRange(target)
}

export const output = false
