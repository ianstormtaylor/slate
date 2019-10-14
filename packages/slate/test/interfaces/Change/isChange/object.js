import { Change } from 'slate'

export const input = {}

export const test = value => {
  return Change.isChange(value)
}

export const output = false
