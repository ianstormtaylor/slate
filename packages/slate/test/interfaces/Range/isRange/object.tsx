import {SlateRange} from 'slate'

export const input = {}
export const test = value => {
  return SlateRange.isRange(value)
}
export const output = false
