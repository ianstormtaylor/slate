import { Range } from 'slate'

export const input = {
  range: {
    anchor: {
      path: [0, 4],
      offset: 7,
    },
    focus: {
      path: [0, 4],
      offset: 7,
    },
  },
  another: {
    anchor: {
      path: [0, 1],
      offset: 0,
    },
    focus: {
      path: [0, 1],
      offset: 0,
    },
  },
}
export const test = ({ range, another }) => {
  return Range.equals(range, another)
}
export const output = false
