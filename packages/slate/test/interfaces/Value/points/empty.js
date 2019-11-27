import { Value } from 'slate'

export const input = {
  children: [],
  selection: null,
}

export const test = value => {
  return Array.from(Value.points(value))
}

export const output = []
