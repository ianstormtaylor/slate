import { Location, Point } from 'slate'

export const input: Point = { path: [0, 1], offset: 2 }
export const test = (value: typeof input) => {
  return Location.isSpan(value)
}
export const output = false
