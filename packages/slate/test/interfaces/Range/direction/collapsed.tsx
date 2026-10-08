import { Range } from 'slate'

export const input = {
  anchor: {
    path: [1],
    offset: 2,
  },
  focus: {
    path: [1],
    offset: 2,
  },
}
export const test = range => {
  return Range.direction(range)
}
export const output = 'collapsed'
