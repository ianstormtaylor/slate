import { Value } from 'slate'

export const input = {
  nodes: [],
  annotations: {},
}

export const test = value => {
  return Value.isValue(value)
}

export const output = false
