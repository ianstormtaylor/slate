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
export const test = value => {
  return Array.from(Range.points(value))
}
export const output = [
  [input.anchor, 'anchor'],
  [input.focus, 'focus'],
]
