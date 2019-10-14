import { Selection } from 'slate'

export const input = true

export const test = value => {
  return Selection.isSelection(value)
}

export const output = false
