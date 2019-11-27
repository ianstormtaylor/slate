import { Value } from 'slate'

export const input = {
  children: [],
}

export const test = value => {
  return Value.isValue(value)
}

export const output = false
