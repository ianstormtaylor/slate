import { Range } from 'slate'

export const input = {
  focus: {
    path: [0, 1],
    offset: 0,
  },
}
export const test = value => {
  return Range.isRange(value)
}
export const output = false
