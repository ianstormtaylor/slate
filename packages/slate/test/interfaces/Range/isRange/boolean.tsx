import {SlateRange} from 'slate'

export const input = true
export const test = value => {
  return SlateRange.isRange(value)
}
export const output = false
