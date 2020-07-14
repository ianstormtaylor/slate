import { Range } from 'slate'

export const input = {
  anchor: {
    path: [3],
    offset: 0,
  },
  focus: {
    path: [0],
    offset: 0,
  },
}
export const test = range => {
  return Range.isForward(range)
}
export const output = false
