import { Value } from 'slate'

export const input = {
  nodes: [],
  selection: null,
  annotations: {},
}

export const test = value => {
  return Array.from(Value.points(value))
}

export const output = []
