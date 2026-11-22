import { Range } from 'slate'

export const input = {
  range: {
    anchor: {
      path: [0, 0],
      offset: 0,
    },
    focus: {
      path: [0, 0],
      offset: 10,
    },
  },
  target: {
    anchor: {
      path: [0, 0],
      offset: 5,
    },
    focus: {
      path: [0, 0],
      offset: 2,
    },
  },
}
export const test = ({ range, target }) => {
  return Range.surrounds(range, target)
}
export const output = true
