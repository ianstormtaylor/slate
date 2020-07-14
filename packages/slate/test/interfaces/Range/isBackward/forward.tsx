import { Range } from 'slate'

export const input = {
  anchor: {
    path: [0],
    offset: 0,
  },
  focus: {
    path: [3],
    offset: 0,
  },
}
export const test = range => {
  return Range.isBackward(range)
}
export const output = false
