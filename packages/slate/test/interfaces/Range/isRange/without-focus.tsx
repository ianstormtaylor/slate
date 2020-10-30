import { SlateRange } from 'slate'

export const input = {
  anchor: {
    path: [0, 1],
    offset: 0,
  },
}
export const test = value => {
  return SlateRange.isRange(value)
}
export const output = false
