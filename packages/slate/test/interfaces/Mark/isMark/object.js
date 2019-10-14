import { Mark } from 'slate'

export const input = {}

export const test = value => {
  return Mark.isMark(value)
}

export const output = true
