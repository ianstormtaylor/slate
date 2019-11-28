import { Mark } from 'slate'

export const input = {
  custom: 'value',
}

export const test = value => {
  return Mark.isMark(value)
}

export const output = true
