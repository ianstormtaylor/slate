import { Range } from 'slate'

export const input = {
  anchor: {
    path: [0],
    offset: 0,
  },
  focus: {
    path: [0],
    offset: 0,
  },
}
export const test = range => {
  return Range.edges(range)
}
export const output = [
  {
    path: [0],
    offset: 0,
  },
  {
    path: [0],
    offset: 0,
  },
]
