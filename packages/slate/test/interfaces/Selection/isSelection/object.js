import { Selection } from 'slate'

export const input = {}

export const test = value => {
  return Selection.isSelection(value)
}

export const output = false
