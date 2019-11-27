import { Value } from 'slate'

export const input = {
  selection: null,
}

export const test = value => {
  return Value.isValue(value)
}

export const output = false
