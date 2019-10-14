import { Mark } from 'slate'

export const input = []

export const test = value => {
  return Mark.isMarkSet(value)
}

export const output = true
