import { Value } from 'slate'

export const input = {
  nodes: [],
  selection: null,
  annotations: {},
}

export const test = value => {
  return Value.isValue(value)
}

export const output = true
