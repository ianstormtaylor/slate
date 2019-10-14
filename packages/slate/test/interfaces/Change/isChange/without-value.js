import { Change } from 'slate'

export const input = {
  operations: [],
}

export const test = value => {
  return Change.isChange(value)
}

export const output = false
