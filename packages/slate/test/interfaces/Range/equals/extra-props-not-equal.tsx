import { Range } from 'slate'

export const input = {
  range: {
    anchor: {
      path: [0, 1],
      offset: 0,
    },
    focus: {
      path: [0, 1],
      offset: 0,
    },
    sameProp: 1,
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
    sameProp: 1,
    extraProp: 1,
  },
}
export const test = ({ range, another }) => {
  return [Range.equals(range, another), Range.equals(another, range)]
}
export const output = [false, false]
