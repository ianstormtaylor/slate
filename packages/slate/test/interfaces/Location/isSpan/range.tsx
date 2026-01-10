import { Location, Range } from 'slate'

export const input: Range = {
  anchor: { path: [0, 1], offset: 2 },
  focus: { path: [3, 4], offset: 5 },
}
export const test = (value: typeof input) => {
  return Location.isSpan(value)
}
export const output = false
