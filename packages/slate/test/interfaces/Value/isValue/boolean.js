import { Value } from 'slate'

export const input = true

export const test = value => {
  return Value.isValue(value)
}

export const output = false
