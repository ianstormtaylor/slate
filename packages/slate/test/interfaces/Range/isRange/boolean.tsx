import { Range } from 'slate'

export const input = true
export const test = value => {
  return Range.isRange(value)
}
export const output = false
