import { Mark } from 'slate'

export const input = true

export const test = value => {
  return Mark.isMark(value)
}

export const output = false
